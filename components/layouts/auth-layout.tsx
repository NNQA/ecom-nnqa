import { ReactNode } from 'react'
import { Pagination } from '../pagination';
import Footer from '../ui/footer';
import Logo from '../ui/logo';


interface AuthLayoutProps {
    children?: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className='min-h-screen bg-background flex flex-col'>
            <Pagination />
            <div className='w-full mx-auto md:w-1/2 py-12 px-4'>
                <div className='max-w-md mx-auto'>
                    <div className='mb-8 flex justify-center items-center md:hidden'>
                        <Logo size='lg' showText />
                    </div>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AuthLayout