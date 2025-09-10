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

resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts@2021-04-15' existing = {
  name: cosmosDbAccountName
}


// MongoDB Database 
resource cosmosDbDatabase 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2021-04-15' = {
  name: 'webappdb'
  parent: cosmosDb
  dependsOn: [
    cosmosDb
  ]
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
  dependsOn: [
    cosmosDbDatabase
  ]
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
