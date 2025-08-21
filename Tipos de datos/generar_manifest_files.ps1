# Comando para correrlo, dentro de la carpeta raiz de scorm
# powershell -ExecutionPolicy Bypass -File generar_manifest_files.ps1

# Genera lista de archivos relativos desde assets y pages
$archivos = Get-ChildItem assets, pages -Recurse -File | ForEach-Object {
    $_.FullName.Replace("$PWD\", "")
}

# Archivo de salida
$outfile = "files.xml"

# Borra salida previa si existe
if (Test-Path $outfile) { Remove-Item $outfile }

# Escribe cada archivo en formato <file href="..."/>
foreach ($ruta in $archivos) {
    $ruta = $ruta.Trim()
    if ($ruta -ne "") {
        Add-Content $outfile "<file href=""$ruta""/>"
    }
}

Write-Host "✅ Bloque generado en $outfile listo para pegar en imsmanifest.xml"
