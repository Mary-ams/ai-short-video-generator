import React, { useContext } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import { useRouter } from 'next/navigation';

function Header() {
  const {userDetail, setUserDetail}=useContext(UserDetailContext);
  const router = useRouter();

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };
  return (
    <div className='p-3 px-5 flex item-center justify-between shadow-md'> 
        <div className='flex gap-3 items-center'>
            <Image src={'/logo.svg'} width={30} height={30} alt='logo'/>
            <h2 className='font-bold text-xl'> Ai Short Vid</h2>
        </div>
        <div className='flex gap-3 item-center'>    
          <div className='flex gap-1 items-center'>
            <Image src={'/star.png'} alt='coin' width={20} height={20}/>
            <h2>{userDetail?.credits}</h2>
          </div>
          <Button onClick={handleDashboardClick}>Dashboard</Button>
          <UserButton/>
        </div>
    </div>
  )
}

export default Header
