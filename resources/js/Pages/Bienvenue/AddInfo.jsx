import React from 'react'

function AddInfo() {
return (
<div className='flex flex-col items-center justify-center h-screen '>
    <div className='w-90 md:w-1/2 mx-auto  text-center'>
        <div className="text-center">

            <img src='assets/images/logo.png' alt='logo' className='mx-auto mb-3' />
            <h4 className='mb-12'>Personnalisez votre application <br />
                avec les détails de votre hôpital.</h4>
            <h6 className='mb-12  text-neutral-500'>Veuillez fournir les informations suivantes :</h6>
            <div className="flex  flex-col sm:flex-row gap-2 justify-between ">
                <div class="mb-3 text-left w-100">
                    <label for="exampleInput" class="form-label">Nom de l’établissement</label>
                    <input type='text' className='form-control h-56-px bg-white radius-12'
                        placeholder='Nom de l’établissement' name="Nom_Etablissement" />
                </div>
                <div class="mb-3 text-left w-100">
                    <label for="exampleInput" class="form-label">Email</label>
                    <input type='email' className='form-control h-56-px bg-white radius-12' placeholder='Email'
                        name="email" />
                </div>
            </div>
            <div className="flex  flex-col sm:flex-row gap-2   justify-between">
                <div class="mb-3 text-left w-100">
                    <label for="exampleInput" class="form-label">Télèphone</label>
                    <input type='number' className='form-control h-56-px bg-white radius-12' placeholder='Télèphone'
                        name="Télèphone" />
                </div>
                <div class="mb-3 text-left w-100">
                    <label for="exampleInput" class="form-label">Adresse</label>
                    <input type='text' className='form-control h-56-px bg-white radius-12' placeholder='Adresse'
                        name="adresse" />
                </div>



            </div>
            <button className=' btn-radius btn btn-primary text-sm btn-sm px-2 py-2 w-50 mt-3'>
                suivant
            </button>
        </div>
    </div>
</div>
)
}

export default AddInfo
