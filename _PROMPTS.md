# Help to create a new UI/UX

1. Let me input the for: url, API Key and Project in order to fetch the data API from KobolToolBox

2. Fetch the data from KoboltoolBox using step 1. inputs

- Use schema.graphql, mutations, queries  
- From the project: "Levantamiento Info Parcelas"
- For every column name create a new feature if doesn't exist.
- Use every row to create a new "Tree" and asociate the "Feature" created with its corresponding value
- For the colum audio upload to S3 amplify configured storage bucket and asociate the feature with the s3 URL using the corresponding TreeID.

## Audio features to Trees lambda funciont an UI

1. Help me to create a amplify lambda function that:

- Recieve as a parameters the tree ID or IDs to be process, or all the trees. Also the template. Gemini API key.
- For every audio audio detected for instances the "audio_levantamiento" in the Trees from using the GraphQL API.
- Use the Features asociated to a "Template" as a key words to find the features and its value in to the audio using Gemini API as follow in the next python code as an example.
- For every feature detected form the template in the audio, set the value creating the RawData with its own tree_id, feature_id and value


```python
import google.generativeai as genai

# Configure your API Key
genai.configure(api_key="YOUR_API_KEY")

# 1. Upload the audio (File API is recommended for long audios)
audio_file = genai.upload_file(path="field_inventory.mp3")

# 2. Configure the model for JSON output
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash", # Flash is ideal for speed and cost
    generation_config={
        "response_mime_type": "application/json",
    }
)

# 3. Prompt with your list of keywords from the Template
prompt = """
Extract the technical information from the audio and return it strictly in JSON format.
If a value is not mentioned, set it to null.
Required fields:
- plot_number (string)
- tree_number (integer)
- dbh (number)
- total_height (number)
- commercial_height (number)
- observations (string)
"""

response = model.generate_content([prompt, audio_file])
extracted_data = response.text # This is now a JSON string
```

2. Create a new UI component

- Name it as "Audio to features"
- Add to the sidebar
- Allow to set the function parameters
- Show the total audios detected for every tree
- Show the progress for every tree audio process

KoboToolbox Import allow me to set a date day to be process using the field "start"

There is a new property "are_audios_processed" in the "Tree" entity, after process the audios set in true, and use this property

## Pivoted Table 

Help to create a new UI component and add to the sidebar, where allow: 
- Select the project to load the trees that belongs to the project
- Select the feature that is going to be use to pivot the table
- Load the trees and show a table pivoted by pivoted feature with all the features values in a single row
- Add pagination to the table
- Add a button to export the table to a CSV file

## Topology - "Tree Hierarchy"

Help to create a new Ux/Ui component under "Topology" left menu and named "Trees Hierarchy" with the following features:

1. Allow drill-down from root parent "Topology"
2. Show the under the selected leaf the contains Tree "Topology" drille-down


## Versioning and testing

Help to establish a process and methodology to manage versioning and testing based on pull request on main branch.

### Goals
- Keep `main` always deployable.
- Make changes traceable (what/why), reproducible (tagged versions), and safe (tests + reviews).
- Automate as much as possible in CI; minimize “it works on my machine”.

### Branching & environments
- **`main`**: protected, always green, only merged via PR.
- **Feature branches**: `feat/<short>`, `fix/<short>`, `chore/<short>`, `docs/<short>`.
- **Release tags**: `vX.Y.Z` (SemVer).
- **Environments**:
  - **PR Preview**: optional; deploy ephemeral preview builds per PR.
  - **Staging**: auto-deploy from `main` (or from release branch if you adopt them).
  - **Production**: deploy only from **signed tag** `vX.Y.Z` (or from GitHub Release).

### PR rules (to merge into `main`)
- **Small PRs**: prefer < 300 LOC changed; split if larger.
- **Review**: at least 1 approval (2 for risky areas: auth, payments, data migrations).
- **Required checks** (CI must pass):
  - Typecheck / build
  - Lint / format
  - Unit tests
  - Integration tests (if applicable)
  - E2E smoke (optional but recommended for FE)
- **No direct commits** to `main`; no merge without green checks.
- **Definition of Done** in PR description:
  - What changed + why
  - Test evidence (CI + manual steps if any)
  - Screenshots/video for UI changes
  - Risk notes + rollback plan for risky changes

### Commit/PR conventions (for versioning automation)
Use **Conventional Commits** (recommended) so releases can be generated automatically.
- `feat: ...` → minor bump
- `fix: ...` → patch bump
- `perf: ...` → patch/minor depending on impact
- `refactor: ...`, `chore: ...`, `docs: ...`, `test: ...` → no bump by default
- `feat!: ...` or `fix!: ...` or `BREAKING CHANGE:` in body → major bump

PR title should follow the same pattern when squash-merging.

### Versioning policy (SemVer)
- **MAJOR** \(X\): breaking changes (API/behavior changes requiring consumer updates)
- **MINOR** \(Y\): backward-compatible feature additions
- **PATCH** \(Z\): backward-compatible bug fixes

Release cadence options:
- **Continuous delivery**: every merge to `main` can ship to staging; production ships on tag.
- **Release train**: weekly/biweekly production tags; hotfix tags as needed.

### Testing strategy (what to write)
Use a “pyramid” and keep fast tests dominant.
- **Unit tests** (fast, many):
  - Pure functions, reducers, hooks, utility modules
  - Component behavior without real network (mocked API)
- **Integration tests** (medium):
  - Pages/flows with routing, state, API mocked at boundary
  - GraphQL layer: generated types, query/mutation wrappers (mock server)
- **E2E tests** (slow, few but critical):
  - Login (if applicable), core navigation, core CRUD flow, key reports/tables
  - One “smoke suite” that runs on every PR; full suite nightly or pre-release

### CI pipeline (recommended gates for PR → `main`)
On every PR:
- Install deps with lockfile (deterministic)
- **Typecheck** (TS)
- **Lint** (ESLint) + **format** (Prettier check)
- **Unit + integration tests** with coverage threshold (start modest, raise gradually)
- **Build** (ensures production build works)
- **E2E smoke** against preview (if enabled) or local test server

On merge to `main`:
- Re-run critical checks (or rely on required checks + protected branch)
- Deploy to staging

On tag `vX.Y.Z`:
- Build + test (again, reproducible)
- Publish GitHub Release with generated changelog
- Deploy to production

### Changelog & release notes
- Maintain `CHANGELOG.md` generated from Conventional Commits (recommended).
- Release notes should include:
  - Added / Changed / Fixed
  - Breaking changes (if any) with migration steps
  - Known issues

### Hotfix process
- Create branch `hotfix/<short>` from the production tag (or `main` if you deploy only from `main`)
- Minimal change + focused tests
- PR into `main` (still required checks)
- Tag `vX.Y.(Z+1)` and deploy

### Minimal “first step” setup checklist
- Protect `main` (require PR, require approvals, require status checks)
- Add CI checks: lint, typecheck, test, build
- Adopt Conventional Commits + squash merge PRs
- Add automated versioning + changelog (e.g., Release Please / semantic-release)
