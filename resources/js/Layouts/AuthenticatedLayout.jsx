import ApplicationLogo from '@/Components/Child/ApplicationLogo';
import Dropdown from '@/Components/Child/Dropdown';
import NavLink from '@/Components/Child/NavLink';
import ResponsiveNavLink from '@/Components/Child/ResponsiveNavLink';
import { Link, usePage, router, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, logout, resetAuth, fetchAuthUser } from '../Redux/auth/authSlice';
import ChatMainLayer from '@/Pages/Components/Chat/ChatMainLayer';

export default function AuthenticatedLayout({ header, children }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { auth } = usePage().props;

    // Synchroniser l'utilisateur Inertia avec Redux
    useEffect(() => {
        if (auth && auth.user && !user) {
            dispatch(setUser(auth.user));
        }
    }, [auth, dispatch, user]);

    useEffect(() => {
        // Récupérer le token de la session
        const token = document.querySelector('meta[name="token"]')?.content;
        if (token) {
            localStorage.setItem('token', token);
        }
        
        // Vérifier l'authentification
        dispatch(fetchAuthUser());
    }, [dispatch]);

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // Fonction pour gérer la déconnexion
    const handleLogout = async (e) => {
        e.preventDefault();
        
        try {
            // 1. Nettoyage Redux et localStorage
            dispatch(resetAuth());
            
            // 2. Déconnexion Laravel via Inertia
            await router.post(route('logout'));
            
            // 3. Forcer la réinitialisation du status
            dispatch({ type: 'auth/resetStatus' });
            
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    const handleProfileClick = () => {
        router.visit(route('user.profile'));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Profile</title>
                <meta name="token" content={localStorage.getItem('token')} />
            </Head>

            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user?.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link onClick={handleProfileClick}>
                                            Mon Profil
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('user.profile')}>
                                            Modifier le Profil
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Déconnexion
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">
                                {user?.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">{user?.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink onClick={handleProfileClick}>
                                Mon Profil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('user.profile')}>
                                Modifier le Profil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Déconnexion
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
            
            {/* Chat component */}
            <ChatMainLayer />
        </div>
    );
}
