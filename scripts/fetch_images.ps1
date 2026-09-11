$urls = @{
  "ethernet" = "https://unsplash.com/s/photos/ethernet-cable"
  "router" = "https://unsplash.com/s/photos/wifi-router"
  "switch" = "https://unsplash.com/s/photos/network-switch"
  "charger" = "https://unsplash.com/s/photos/usb-charger"
  "usbhub" = "https://unsplash.com/s/photos/usb-hub"
  "powerstrip" = "https://unsplash.com/s/photos/power-strip"
  "cctv" = "https://unsplash.com/s/photos/security-camera"
  "conference" = "https://unsplash.com/s/photos/conference-room"
}

foreach ($key in $urls.Keys) {
  $url = $urls[$key]
  try {
    $resp = Invoke-WebRequest -Uri $url -UserAgent "Mozilla/5.0"
    $m = [regex]::Matches($resp.Content, "https://images.unsplash.com/photo-[a-zA-Z0-9_-]+")
    $unique = $m | Select-Object -ExpandProperty Value -Unique | Select-Object -First 3
    Write-Host "$key : $($unique -join ' | ')"
  } catch {
    Write-Host "$key : Error $($_.Exception.Message)"
  }
}
