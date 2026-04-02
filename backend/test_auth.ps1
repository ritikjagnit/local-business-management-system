try {
    Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/auth/register" -ContentType "application/json" -Body '{"username":"testshop2", "password":"password123", "role":"SHOP_OWNER"}'
} catch {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object IO.StreamReader($stream)
    $reader.ReadToEnd()
}
