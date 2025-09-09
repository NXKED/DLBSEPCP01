@description('Name der Static Web App')
param staticWebAppName string

@description('Name des CosmosDB Accounts')
param cosmosDbAccountName string

@description('Region')
param location string = resourceGroup().location

@description('Github Repo URL')
param repoUrl string

@description('Branch')
param branch string

@description('Verbindungsstring fuer CosmosDB')
param mongoUrl string

// Cosmos DB ACC
resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts@2025-05-01-preview' = {
  name: cosmosDbAccountName
  location: location
  kind: 'MongoDB'
  tags: {
    'hidden-workload-type': 'Learning'
  }
  properties: {
    databaseAccountOfferType: 'Standard'
    enableMultipleWriteLocations: false //bcof availability zone issue
    enableAutomaticFailover: false // ^^
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false // ^^
      }
    ]
    apiProperties: {
      serverVersion: '7.0'
    }
    capacityMode: 'Serverless'
    enableFreeTier: true
    capabilities: [
      {
        name: 'EnableMongo'
      }
    ]
  }
}


// MongoDB Database 
resource cosmosDbDatabase 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2021-04-15' = {
  name: 'webappdb'
  parent: cosmosDb
  properties: {
    resource: {
      id: 'webappdb'
    }
  }
}

// MongoDB Collection
resource cosmosDbCollection 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections@2021-04-15' = {
  name: 'items'
  parent: cosmosDbDatabase
  properties: {
    resource: {
      id: 'items'
      shardKey: {_id: 'Hash'}
      indexes: []
    }
    options: null
  }
}


// Static Web App SWA 
resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: staticWebAppName
  location: location
  sku:{
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
  name: 'appsettings'
  parent: staticWebApp
  properties: {
    MONGO_URL: mongoUrl
  }
}
