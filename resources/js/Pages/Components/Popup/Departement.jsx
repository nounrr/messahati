import React, { useState } from 'react'

function Departement(props) {

    const [isActive, setIsActive] = useState(false)
    const Activate = ()=>{
        console.log('active');
        
                 setIsActive(true)
    }
    const Desactivate = ()=>{
        setIsActive(false)
    }
  return (
    
<div className='flex flex-col m-auto items-center justify-center w-50 border-4 bg-white '>
    <div className='w-100 md:w-1/2 mx-auto  text-center'>
        <div className="text-center">

            <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-3' />
            <h4 className='mb-12'>Ajoutez les différents Départements.</h4>
            <h6 className='mb-12  text-neutral-500'>Veuillez fournir les informations suivantes :</h6>
            <div className="flex  flex-col gap-2 justify-between ">
               
                <div class="mb-3 text-left w-100">
                    <label for="exampleInput" class="form-label">Libellé</label>
                    <input type='email' className='form-control h-56-px bg-white radius-12' placeholder='Email'
                        name="email" />
                </div>
                <div class="mb-3 text-left w-100">
                    <label for="exampleInput" class="form-label">Description</label>
                    <textarea name="" cols="30" rows="10" className='form-control h-56-px bg-white radius-12'></textarea>
                </div>
            </div>
            <div className="flex gap-2 ">
            <button className=' btn-radius btn btn-success text-sm btn-sm px-2 py-2 w-50 mt-3'>
                Ajouter Une autre
            </button>
            <button className=' btn-radius btn btn-primary text-sm btn-sm px-2 py-2 w-50 mt-3'>
                suivant
            </button>
            </div>
        </div>
    </div>
</div>
  )
}

export default Departement