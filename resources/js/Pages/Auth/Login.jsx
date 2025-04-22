import { Icon } from "@iconify/react";
import React, { useEffect } from "react";
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/Child/InputError';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import axios from 'axios';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/login', data);
            
            if (response.data.token) {
                // Store the token in localStorage
                localStorage.setItem('token', response.data.token);
                
                // Redirect to dashboard
                window.location.href = '/dashboard';
            } else {
                console.error('No token received');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            // Handle specific error cases
            if (error.response?.status === 422) {
                // Validation errors
                const validationErrors = error.response.data.errors;
                Object.keys(validationErrors).forEach(key => {
                    errors[key] = validationErrors[key][0];
                });
            }
        }
    };

    return (
        <section className='auth bg-base d-flex flex-wrap'>
            <div className='auth-left d-lg-block d-none'>
                <div className='d-flex align-items-center flex-column justify-content-center'>
                    <img className="h-screen object-cover" src='/assets/images/auth/auth-img.png' alt='' />
                </div>
            </div>
            <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
                <div className='max-w-464-px mx-auto w-100'>
                    <div className="text-center">
                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}
                        <Link href='/' className='mb-40 max-w-290-px'>
                            <img src='/assets/images/logo.png' alt='' />
                        </Link>
                        <h4 className='mb-12'>Connectez-vous à votre compte</h4>
                        <p className='mb-32 text-secondary-light text-lg'>
                            Bon retour ! Veuillez entrer vos coordonnées
                        </p>
                    </div>
                    <form onSubmit={submit}>
                        <div className='icon-field mb-16'>
                            <span className='icon top-50 translate-middle-y'>
                                <Icon icon='mage:email' />
                            </span>
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder='Email'
                                autoComplete="username"
                            />
                            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                        </div>
                        <div className='position-relative mb-20'>
                            <div className='icon-field'>
                                <span className='icon top-50 translate-middle-y'>
                                    <Icon icon='solar:lock-password-outline' />
                                </span>
                                <TextInput
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    placeholder='Password'
                                    autoComplete="current-password"
                                />
                            </div>
                            <span
                                className='toggle-password ri-eye-line cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light'
                                data-toggle='#your-password'
                            />
                            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                        </div>
                        <div className=''>
                            <div className='d-flex justify-content-between gap-2'>
                                <div className='form-check style-check d-flex align-items-center'>
                                    <Checkbox
                                        id="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <Label htmlFor="remember" className="ml-2">
                                        Remember me
                                    </Label>
                                </div>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className='text-primary-600 fw-medium'>
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div>
                            <Button
                                type="submit"
                                className="w-full btn-radius btn btn-primary text-sm btn-sm px-12 py-16 mt-32"
                                disabled={processing}
                            >
                                Sign In
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

