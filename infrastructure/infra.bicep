@description('Name der Static Web App')
param staticWebAppName string

@description('Name des CosmosDB Accounts')
param cosmosDbAccountName string

@description('Region')
param location string = resourceGroup().location

@description('Github Repo URL')
param repoUrl string

@description('Branch')
param branch string = 'main'

@description('Verbindungsstring fuer CosmosDB')
param mongoUrl string

// Cosmos DB 
resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts@2021-04-15' = {
  name: cosmosDbAccountName
  location: location
  kind: 'MongoDB'
  tags: {
    'hidden-workload-type': 'Learning'
  }
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
      }
    ]
    apiProperties: {
      serverVersion: '4.0'
    }
  }
}

// Static Web App SWA 
resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: repoUrl
    branch: branch
    buildProperties: {
      appLocation: '/'
      apiLocation: 'api'
      outputLocation: ''
    }
  }
}

// App Settings 
resource staticWebAppSettings 'Microsoft.Web/staticSites/config@2022-03-01' = {
  name: '${staticWebApp.name}/config'
  properties: {
    MONGO_URL: mongoUrl
  }
  dependsOn: [
    staticWebApp
  ]
}
