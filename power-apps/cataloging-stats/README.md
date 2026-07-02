# Microsoft Power Apps canvas app: Suivi catalogage

This folder contains source-controlled Microsoft Power Apps canvas-app source for a SharePoint-list-backed app based on the provided `ListSchema`.

## What is included

- `CanvasManifest.json`: app metadata for a tablet canvas app.
- `Connections/SharePoint.json`: the SharePoint connector/data-source mapping that lists the SharePoint internal field names from the schema.
- `Src/App.fx.yaml`: app-level Power Fx formulas and theme settings.
- `Src/Screens.yaml`: screen index.
- `scripts/build-msapp.sh`: local helper to generate `dist/SuiviCatalogage.msapp` outside the PR because binary files are not supported by this review flow.
- `Src/Screens/HomeScreen.fx.yaml`: a single-screen canvas app with:
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


## Generate the `.msapp` locally

Binary `.msapp` files are not committed because this PR flow rejects binary files. Run the helper script from this folder to generate the package locally:

```bash
./scripts/build-msapp.sh
```

The script uses `pac canvas pack` when the Power Platform CLI is installed. If `pac` is unavailable, it creates a local `.msapp` zip archive from the source files so you still have a local artifact to inspect.

## Packaging check

From this folder, validate the source with the Power Platform CLI:

```powershell
pac canvas pack --sources . --msapp SuiviCatalogage.msapp
```

If `pac` is not installed, install the Microsoft Power Platform CLI first, then rerun the command. In this container, the command was attempted but failed because `pac` is not available on `PATH`.

> Note: `dist/SuiviCatalogage.msapp` is intentionally not committed because this PR flow rejects binary files. Generate it locally with `scripts/build-msapp.sh`. The preferred validation path remains `pac canvas pack`; in this container the Power Platform CLI is unavailable, so PAC validation could not be completed here.
