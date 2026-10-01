$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
    $portfolioNode = $nodeCommand.Source
} else {
    $runtimeRoot = Join-Path $env:LOCALAPPDATA 'OpenAI/Codex/runtimes/cua_node'
    $portfolioNode = Get-ChildItem -Path "$runtimeRoot/*/bin/node.exe" -File -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
}
if (-not $portfolioNode) { throw 'Instala Node.js 22.12 o superior y ejecuta npm ci.' }
if (-not (Test-Path 'node_modules/astro')) { throw 'Faltan dependencias. Ejecuta npm ci.' }
& $portfolioNode scripts/astro.mjs build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& $portfolioNode scripts/write-headers.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& $portfolioNode scripts/astro.mjs preview --host 127.0.0.1 --port 4321
