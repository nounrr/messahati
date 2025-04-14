import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/Child/InputError';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
 
    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };
  return (
    <section className='auth bg-base d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className=' d-flex align-items-center flex-column  justify-content-center  '>
          <img className="h-screen object-cover  " src='assets/images/auth/auth-img.png' alt='' />
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
            <Link to='/' className='mb-40 max-w-290-px'>
              <img src='assets/images/logo.png' alt='' />
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
              <input
                type='email'
                name='email'
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Email'
                autoComplete="username"
                value={data.email}

                onChange={(e) => setData('email', e.target.value)}
              />
               <InputError message={errors.email} className="mt-2" />
              
            </div>
            <div className='position-relative mb-20'>
              <div className='icon-field'>
                <span className='icon top-50 translate-middle-y'>
                  <Icon icon='solar:lock-password-outline' />
                </span>
                <input
                  type='password'
                  className='form-control h-56-px bg-neutral-50 radius-12'
                  id='your-password'
                  placeholder='Password'
                  name="password"
                  value={data.password}
                  autoComplete="current-password"
                  onChange={(e) => setData('password', e.target.value)}

                />
              </div>
              <span
                className='toggle-password ri-eye-line cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light'
                data-toggle='#your-password'
              />
              <InputError message={errors.password} className="mt-2" />
              
            </div>
            <div className=''>
              <div className='d-flex justify-content-between gap-2'>
                <div className='form-check style-check d-flex align-items-center'>
                  <input
                    className='form-check-input border border-neutral-300'
                    type='checkbox'
                    name="remember"
                    checked={data.remember}
                    onChange={(e) =>
                        setData('remember', e.target.checked)
                    }
                  />
                  <label className='form-check-label' htmlFor='remeber'>
                    Remember me{" "}
                  </label>
                </div>
                <Link to='#' className='text-primary-600 fw-medium'>
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button
              type='submit'
              className=' btn-radius btn btn-primary text-sm btn-sm px-12 py-16 w-100 mt-32'
              disabled={processing}
            >
              {" "}
              Sign In
            </button>
            
            
            
          </form>
        </div>
      </div>
    </section>
  );
};

