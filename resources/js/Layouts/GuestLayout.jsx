import ApplicationLogo from '@/Components/Child/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            {children}
        </div>
    );
}
