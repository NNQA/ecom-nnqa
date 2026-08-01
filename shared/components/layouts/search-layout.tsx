import { ReactNode } from 'react'
import { Pagination } from '../pagination';
import Footer from '../ui/footer';
import Logo from '../ui/logo';


interface SearchLayoutProps {
    children?: ReactNode;
}

function SearchLayout({ children }: SearchLayoutProps) {
    return (
        <div className='min-h-screen bg-background flex flex-col'>
            <Pagination />
            <div className='w-full mx-auto'>
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default SearchLayout