<?php

namespace App\Traits;

use Maatwebsite\Excel\Facades\Excel;

trait ExcelExportImport
{
    /**
     * Export data to Excel.
     *
     * @param  string  $exportClass
     * @param  string  $fileName
     * @param  mixed   $data
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function exportExcel($exportClass, $fileName, $data)
    {
        return Excel::download(new $exportClass($data), $fileName);
    }

    /**
     * Import data from Excel.
     *
     * @param  \Illuminate\Http\UploadedFile  $file
     * @param  string  $importClass
     * @return void
     */
    public function importExcel($file, $importClass)
    {
        Excel::import(new $importClass, $file);
    }
}
