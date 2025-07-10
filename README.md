Azure Static Web App;
Infrastructure bicep ;
Resources: Azure CosmosDB for MongoDB, Azure SWA with functions

# How to Deploy

1. Azure CLI installieren
2. Bicep CLI installieren
3. Bei Azure anmelden
4. Ressourcengruppe erstellen
   'az group create --name 'XYZ' --location westeurope
5. Bicep datei bereitstellen
   
   'az deployment group create \
    --resource-group 'XYZ' \
    --template-file infrastructure/infra.bicep \
    --parameters @infrastructure/parameters.json'
