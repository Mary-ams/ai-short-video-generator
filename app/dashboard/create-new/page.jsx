"use client"
import React, { useContext, useEffect, useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle';
import { Button } from '@/components/ui/button';
import SelectDuration from './_components/SelectDuration';
import axios from "axios";
import CustomLoading from './_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid';
import { VideoDataContext } from '@/app/_context/VideoDataContext';
import { useUser } from '@clerk/nextjs';
import { Users, VideoData } from '@/configs/schema';
import { db } from '@/configs/db';
import PlayerDialog from '../_components/PlayerDialog';
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import { eq } from 'drizzle-orm';

function CreateNew() {

    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [videoScript, setVideoScript] = useState();
    const [audioFileUrl, setAudioFileUrl] = useState();
    const [captions, setCaptions] = useState();
    const [imageList, setImageList] = useState();
    const [playVideo, setPlayVideo] = useState(false);
    const [videoId, setVideoId] = useState();
    const {videoData, setVideoData} = useContext(VideoDataContext);
    const {userDetail, setUserDetail}=useContext(UserDetailContext);
    const {user}=useUser();
    const onHandleInputChange = (fieldName, fieldValue) => {
        console.log(fieldName, fieldValue)

        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }))
    }

    const onCreateClickHandler = () => {
        if(userDetail?.credits < 0) {
            toast("You don't have enough credits.")
            return;
        }
        GetVideoScript();
    }

    //Get Video Script 
    const GetVideoScript = async () => {
        setLoading(true)
        const prompt = 'Write a script to generate a ' + formData.duration + ' video on topic: ' + formData.topic + ' along with AI image prompt in ' + formData.imageStyle + ' format for each scene and give me result in JSON format with imagePrompt and ContentText as field, No Plain text'
        console.log(prompt)
        try {
            const resp = await axios.post('/api/get-video-script', {
                prompt: prompt
            });
            if (resp.data.result) {
                setVideoData(prev => ({
                    ...prev,
                    'videoScript': resp.data.result
                }))
                setVideoScript(resp.data.result);
                await GenerateAudioFile(resp.data.result)
            } else {
                console.error('Failed to get video script:', resp.data.message);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error getting video script:', error);
            setLoading(false);
        }
    }

    const GenerateAudioFile = async (videoScriptData) => {
        setLoading(true)
        let script = '';
        const id = uuidv4();
        videoScriptData.forEach(item => {
            script = script + item.ContentText + ' ';
        })

        try {
            const resp = await axios.post('/api/generate-audio', {
                text: script,
                id: id
            });
            if (resp.data.result) {
                setVideoData(prev => ({
                    ...prev,
                    'audioFileUrl': resp.data.result
                }))
                setAudioFileUrl(resp.data.result);
                resp.data.result && await GenerateAudioCaption(resp.data.result, videoScriptData)
            } else {
                console.error('Failed to generate audio:', resp.data.message);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error generating audio:', error);
            setLoading(false);
        }
    }
 
    const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
        setLoading(true);
        console.log(fileUrl)
        try {
            const resp = await axios.post('/api/generate-caption', {
                audioFileUrl: fileUrl
            })
            if (resp.data.result) {
                setCaptions(resp?.data?.result);
                setVideoData(prev=>({
                    ...prev,   
                    'captions':resp.data.result
                }))
                resp.data.result && await GenerateImage(videoScriptData);
            } else {
                console.error('Failed to generate caption:', resp.data.message);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error generating caption:', error);
            setLoading(false);
        }
    }

    //Generate image
    const GenerateImage = async (videoScriptData) => {
        let images = [];
        setLoading(true);

        for (const element of videoScriptData) {
            try {
                const resp = await axios.post('/api/generate-image', {
                    prompt: element.imagePrompt
                });
                console.log(resp.data.result);
                images.push(resp.data.result);
            } catch (e) {
                console.log('Error:' + e);
            }
        }
        setVideoData(prev=>({
            ...prev,   
            'imageList':images
        }))
        setImageList(images)
        setLoading(false);
    } 

    useEffect(() => {
        console.log(videoData);
        if (videoData?.videoScript && videoData?.audioFileUrl && videoData?.captions && videoData?.imageList) {
            SaveVideoData(videoData);
        }
    }, [videoData]);
    
    const SaveVideoData = async (videoData) => {
        setLoading(true);
        console.log(videoData);
        try {
            const result = await db.insert(VideoData).values({
                script: videoData?.videoScript,
                audioFileUrl: videoData?.audioFileUrl,
                captions: videoData?.captions,
                imageList: videoData?.imageList,
                createdBy: user?.primaryEmailAddress?.emailAddress
            }).returning({ id: VideoData?.id });
        
            await UpdateUserCredits();
            setVideoId(result[0].id);
            setPlayVideo(true);
            console.log(result);
            setLoading(false);
        } catch (error) {
            console.error('Error saving video data:', error);
            setLoading(false);
        }
    };

    const UpdateUserCredits = async () => {
        try {
            const result = await db.update(Users).set({
                credits: userDetail?.credits - 10
            }).where(eq(Users?.email, user?.primaryEmailAddress?.emailAddress));
            console.log(result);
            setUserDetail(prev => ({
                ...prev,
                'credits': userDetail?.credits - 10
            }))
    
            setVideoData(null);
        } catch (error) {
            console.error('Error updating user credits:', error);
        }
    }

    const onCloseDialog = () => {
        setPlayVideo(false);
    };

    return (
        <div className='md:px-20'>
            <h2 className='font-bold text-4xl text-primary text-center'>Create New</h2>

            <div className='mt-10 shadow-md p-10'>
                {/*Select Topic*/}
                <SelectTopic onUserSelect={onHandleInputChange} />
                {/*Select Style*/}
                <SelectStyle onUserSelect={onHandleInputChange} />
                {/*Duration*/}
                <SelectDuration onUserSelect={onHandleInputChange} />
                {/*Create Button*/}
                <Button className='mt-10 w-full' onClick={onCreateClickHandler}>Create Short Video </Button>
            </div>

            <CustomLoading loading={loading} />
            <PlayerDialog playVideo={playVideo} videoId={videoId} onClose={onCloseDialog} />
        </div>
    )
}

export default CreateNew