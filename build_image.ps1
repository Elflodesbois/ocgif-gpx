if (!(Test-Path ".warning")) {
    echo "Ce script va tuer les conteneurs faisant tourner une app nginx. Ok ? [*O*ui / *N*on / ne plus *M*ontrer]"
    $ans = Read-Host
    switch ($ans.ToUpper()) {
        "O" { Write-Warning "Le script va continuer. Ce message vous sera remontre a l'avenir." }
        "M" { 
            "User warned" | Set-Content ".warning"
            Write-Warning "Le script va continuer. Ce message ne sera plus montre. Supprimez '.warning' pour annuler ce changement."
        }
        Default {
            Write-Warning "Arret du script."
            exit 1
        }
    }
}

while (((docker ps) -Match "nginx") -ne "") {
    echo "Arret de conteneur(s) nginx..."
    docker kill ((docker ps)[1].Split(" ")[0])
}

if (((docker images) -Match "angular-app") -ne "") { 
    echo "Suppression de l'image 'angular-app' deja existante..."
    docker rmi angular-app
    echo "Image supprimee !"
}

echo "Creation de l'image 'angular-app'..."
docker build -t angular-app .  
echo "Image 'angular-app' creee !"
