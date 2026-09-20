# Task 1 fix — unique themed rasters

## Why

Task 1 helper code is correct, but several Unsplash URLs 404ed and the implementer **copied existing files**. SHA256/size duplicates today:

- `emploi-hero.jpg` = `emploi-sante.jpg` = `demo-hero.jpg` = `demo-aines.jpg` (doctor on phone)
- `pont-hero.jpg` = `pont-ville.jpg` (office high-five)

That violates the product: employment must show workers (not reuse one health crop as “aînés”), demography must show aging/family, bridge “Ville” must be a city scene.

## Do this

1. Add a failing uniqueness test in `src/data/canada-live-media.test.ts` inside the existing describe:

```ts
it("keeps each themed raster unique", () => {
  const hashes = files.map((file) => {
    const bytes = readFileSync(join(mediaDir, file));
    return bytes.toString("hex").slice(0, 32) + String(bytes.byteLength);
  });
  expect(new Set(hashes).size).toBe(files.length);
});
```

Prefer `createHash("sha256")` from `node:crypto` if you import it. Confirm RED (duplicates fail).

2. Re-download **only** these four files. Do **not** copy any existing raster. Verify jpeg magic `FF D8 FF` and size > 20_000. If a URL 404s, try the next fallback. Never overwrite a successful unique file with a duplicate.

`emploi-sante.jpg` (hospital/nurse/doctor at work, **not** the current phone-in-lab-coat crop):
- https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=80
- https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1600&q=80
- https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1600&q=80

`demo-aines.jpg` (elderly people, not a doctor):
- https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?auto=format&fit=crop&w=1600&q=80
- https://images.unsplash.com/photo-1444069069008-83a57aac43ac?auto=format&fit=crop&w=1600&q=80
- https://images.unsplash.com/photo-1756048997762-154abc8b8207?auto=format&fit=crop&w=1600&q=80

`demo-hero.jpg` (aging / care / relève — elderly or caregiver with senior, not the phone doctor):
- https://images.unsplash.com/photo-1475724017904-b712052c192e?auto=format&fit=crop&w=1600&q=80
- https://images.unsplash.com/photo-1531983412531-1f9136e6e1b0?auto=format&fit=crop&w=1600&q=80
- https://images.unsplash.com/photo-1576765608535-d73ddb2ed61f?auto=format&fit=crop&w=1600&q=80

`pont-ville.jpg` (Canadian city / skyline / downtown, **not** a meeting):
- https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1600&q=80
- https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80
- https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80

3. Delete extra files not in the original Task 1 spec:
- `scripts/fetch-canada-live.cjs`
- `scripts/fetch-canada-live.js`

You may use a one-off PowerShell `Invoke-WebRequest` in the terminal; do not leave a new fetch script behind.

4. Re-run `npm test -- src/data/canada-live-media.test.ts` — all GREEN, uniqueness included.

5. Do **not** edit `canada.tsx` or `canada-live.ts`. Do **not** run git. Do **not** commit.

6. Append results (RED/GREEN, which URLs succeeded, SHA uniqueness) to `docs/superpowers/sdd/task-1-report.md`. Strip the leftover “PrincipalPanel inner scrollbar” section from that report if still present.

Work from: `c:\Users\Admin\Documents\Projets\Projets_Vibe_coding\IR_Immigration_Sale_plateforme`
