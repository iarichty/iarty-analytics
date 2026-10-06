import { Link } from 'react-router-dom';
import { TbGhost, TbArrowLeft } from 'react-icons/tb';
import HelmetContainer from '@/components/HelmetContainer';

const NotFound = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-neutral-950">
            <HelmetContainer title="Page Not Found | IARTY Analytics" />
            <div className="text-center">
                <div className="relative mb-8 inline-block">
                    <div className="absolute inset-0 animate-pulse bg-green-500 opacity-20 blur-3xl" />
                    <TbGhost className="relative mx-auto h-24 w-24 text-green-600" aria-hidden />
                </div>

                <h1 className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-slate-200 dark:text-neutral-800">
                    404
                </h1>

                <h2 className="mb-4 text-3xl font-bold dark:text-white">Page Not Found</h2>
                <p className="mx-auto mb-8 max-w-md text-slate-500 dark:text-neutral-400">
                    Sorry, the page you are looking for does not exist or has been moved.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700"
                >
                    <TbArrowLeft aria-hidden /> Back to home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
