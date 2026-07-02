# Microsoft Power Apps canvas app: Suivi catalogage

This folder contains source-controlled Microsoft Power Apps canvas-app source for a SharePoint-list-backed app based on the provided `ListSchema`.

## What is included

- `CanvasManifest.json`: app metadata for a tablet canvas app.
- `Connections/SharePoint.json`: the SharePoint connector/data-source mapping that lists the SharePoint internal field names from the schema.
- `Src/App.fx.yaml`: app-level Power Fx formulas and theme settings.
- `Src/Screens.yaml`: screen index.
- `Src/HomeScreen.fx.yaml`: a single-screen canvas app with:
  - KPI cards for nouveautés, rétrospectifs physiques, rétrospectifs numériques, and authority notices.
  - An edit form bound to the SharePoint list data source.
  - A gallery for recent SharePoint list rows.
  - Power Fx formulas for `SubmitForm`, `NewForm`, `Refresh`, and grouped totals.

## How to import into Power Apps

1. Create or identify the target SharePoint list with the fields from the supplied schema.
2. In Power Apps Studio, create a new tablet canvas app.
3. Add a SharePoint data connection and select the target list.
4. Rename the data source to `CatalogageStats` or update the formulas in this source to match your list/data-source name.
5. Recreate/import the screen and formulas from the YAML files in `Src/` using your Power Platform source-control workflow.

> Note: this repository does not include Microsoft `pac` generated binary `.msapp` output. These files are source artifacts intended for a real Microsoft Power Apps canvas app, not an HTML mockup.
