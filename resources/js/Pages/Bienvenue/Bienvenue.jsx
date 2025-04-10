import React from 'react'

function Page1() {
  return (
    <div className='flex flex-col items-center justify-center h-screen '>
     <div className=' mx-auto w-2/3 text-center'>
          <div className="text-center">
          
              <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-3' />
            <h4 className='mb-12'>Bienvenue, Clinique Du Nord</h4>
            <h6 className='mb-12  text-neutral-500'>Bienvenue dans <span className='text-primary-700'>Messahati</span></h6>
            <p className='mb-3 text-secondary-black text-lg'>
            Nous sommes ravis de vous compter parmi nos utilisateurs. <br />
            <span className='text-primary-700'>Messahati</span> est conçu pour simplifier la gestion de votre hôpital, améliorer l'efficacité de vos équipes et offrir une expérience optimale à vos patients.
            </p>
            <button
              className=' btn-radius btn btn-primary text-sm btn-sm px-2 py-2 w-50 mt-3'
            >
              Personnalisez votre application
            </button>
          </div>
         </div>
     </div>
  )
}

export default Page1