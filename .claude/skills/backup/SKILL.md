---
name: backup
description: Crea una copia de seguridad (backup) de este repositorio en un fichero zip con fecha y hora, guardado en una carpeta "_backups" en el directorio padre del repo. Usar cuando el usuario pida "backup", "copia de seguridad", "respaldo" o similar de este proyecto.
---

# Backup del repositorio

Crea un fichero ZIP con una copia completa del repositorio actual y lo guarda
fuera del repo, en `_backups` dentro de la carpeta padre.

## Pasos

1. Averigua la raíz del repo con `git rev-parse --show-toplevel` (no asumas
   que el directorio de trabajo actual es la raíz).
2. La carpeta de destino es `_backups` dentro del directorio padre de la raíz
   del repo (es decir, hermana del repo, no dentro de él). Créala si no
   existe.
3. Genera un timestamp con formato `yyyy-MM-dd_HH-mm-ss` (usa guiones, no
   dos puntos, para que sea válido como nombre de fichero en Windows).
4. El nombre del zip es `<nombre-repo>_backup_<timestamp>.zip`.
5. Comprime todo el contenido del repo (incluyendo ficheros sin trackear en
   git, ya que es una copia de seguridad del estado real en disco), mientras
   se excluyen carpetas `.git` y `node_modules` en cualquier nivel (son
   pesadas y regenerables / ya versionadas). No excluyas nada más salvo que
   el usuario lo pida explícitamente.
6. Tras crear el zip, informa al usuario de la ruta completa del fichero
   creado y su tamaño.

## Implementación (PowerShell)

No hay `zip`/`7z` disponibles en este entorno, así que usa
`System.IO.Compression` desde PowerShell:

```powershell
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$repoRoot = (git rev-parse --show-toplevel) -replace '/', '\'
$parentDir = Split-Path $repoRoot -Parent
$backupDir = Join-Path $parentDir "_backups"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$repoName = Split-Path $repoRoot -Leaf
$zipPath = Join-Path $backupDir "$repoName`_backup_$timestamp.zip"

$excludeDirs = @('.git', 'node_modules')

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    Get-ChildItem -Path $repoRoot -Recurse -Force -File | Where-Object {
        $relative = $_.FullName.Substring($repoRoot.Length + 1)
        $parts = $relative -split '\\'
        -not ($parts | Where-Object { $excludeDirs -contains $_ })
    } | ForEach-Object {
        $relativePath = $_.FullName.Substring($repoRoot.Length + 1)
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $relativePath) | Out-Null
    }
} finally {
    $zip.Dispose()
}

Get-Item $zipPath | Select-Object FullName, @{N='SizeMB';E={[math]::Round($_.Length / 1MB, 2)}}
```

Ejecuta este script con la herramienta de PowerShell. Al terminar, comunica
al usuario la ruta del zip generado y su tamaño en MB.
