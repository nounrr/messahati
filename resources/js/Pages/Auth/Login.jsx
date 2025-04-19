/* resources/js/Pages/Auth/Login.jsx
   ---------------------------------------------------------------
   Formulaire de connexion React + Inertia + Redux Toolkit,
   utilisant les icônes react‑icons (MdEmail, MdLock, MdVisibility).
-----------------------------------------------------------------*/

import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useDispatch, useSelector } from 'react-redux';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';

import { fetchAuthUser, resetAuth } from '@/Redux/auth/authSlice';
import InputError from '@/Components/Child/InputError';

export default function Login({ status }) {
  /* -------------------- Inertia Hook -------------------- */
  const { data, setData, post, processing, errors, reset } = useForm({
    email:     '',
    password:  '',
    remember:  false,
  });

  /* -------------------- Redux --------------------------- */
  const dispatch = useDispatch();
  const { status: authStatus } = useSelector(s => s.auth);

  /* -------------------- Reset auth on mount ------------- */
  useEffect(() => { dispatch(resetAuth()); }, []);

  /* -------------------- Password visibility ------------- */
  const [showPass, setShowPass] = useState(false);

  /* -------------------- Submit -------------------------- */
  const submit = e => {
    e.preventDefault();
    post(route('login'), {
      onSuccess: () => dispatch(fetchAuthUser()),
      onError:   () => reset('password'),
    });
  };

  /* -------------------- Render -------------------------- */
  return (
    <section className="auth bg-base d-flex flex-wrap">
      <Head title="Connexion" />

      {/* Colonne image (desktop) */}
      <div className="auth-left d-none d-lg-block">
        <img src="/assets/images/auth/auth-img.png" alt="" className="h-screen object-cover" />
      </div>

      {/* Colonne formulaire */}
      <div className="auth-right flex-grow-1 d-flex flex-column justify-content-center p-6 lg:p-16">
        <div className="mx-auto w-full max-w-lg">
          {/* Logo + message flash */}
          <div className="text-center mb-10">
            {status && (
              <div className="mb-4 text-sm font-medium text-green-600">
                {status}
              </div>
            )}

            <Link href="/">
              <img src="/assets/images/logo.png" alt="Logo" className="mb-6 h-14 mx-auto" />
            </Link>

            <h4 className="text-2xl font-semibold mb-2">Connectez‑vous à votre compte</h4>
            <p className="text-lg text-gray-500">
              Heureux de vous revoir ! Veuillez saisir vos identifiants.
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={submit} noValidate>
            {/* Email */}
            <div className="mb-4 relative">
              <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                placeholder="E‑mail"
                autoComplete="username"
                required
                className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 bg-neutral-50 focus:ring-primary focus:border-primary"
              />
              <InputError message={errors.email} className="mt-2" />
            </div>

            {/* Password */}
            <div className="mb-4 relative">
              <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                placeholder="Mot de passe"
                autoComplete="current-password"
                required
                className="pl-10 pr-10 py-3 w-full rounded-lg border border-gray-300 bg-neutral-50 focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
              </button>
              <InputError message={errors.password} className="mt-2" />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mb-6 text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={e => setData('remember', e.target.checked)}
                  className="form-check-input border-gray-300"
                />
                Se souvenir de moi
              </label>

              {/* Supprimez ce lien si vous n’avez pas la route */}
              <Link href={route('password.request')} className="text-primary-600 font-medium">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={processing}
              className="btn btn-primary w-full py-3 rounded-lg text-sm disabled:opacity-50"
            >
              {processing ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
