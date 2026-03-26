# Lens Studio Physics Workshop


# Part 1 | Floating Object

Make any 3D object float in place, that bobs up and down and slowly rotates. Hover over it to see an outline highlight. Grab and drag it anywhere, and when you let go it floats from its new position.

## Important Note
If you are adding your own meshes, make sure your object is positioned at the origin (0, 0, 0) before adding the script or the rotation will be off.

## Scene Setup
Start by making an empty scene object called 'Floating Object', and add the following objects within this object to keep things organized!

  ### Step 1 | Create your object
- In the Scene Hierarchy click `+`
-  Add a sphere mesh / any 3D mesh, or import your own `.glb` asset
-   Position it where you'd like 

### Step 2 | Add a Physics Body
- With your object selected click `Add Component`
- Search for `Physics Body` and add it
- Uncheck `Dynamic` otherwise the mesh will fall due to gravity

### Step 3 | Adding other Components
- Click `Add Component` → `Interactable`
- Click `Add Component` → `InteractableManipulation` Component
- Click `Add Component` → `InteractableOutlineFeedback`
  - Under `Mesh Visuals` click `Add Value`, and drag your object's `Render Mesh Visual` component into the slot
- Adjust the hovering color and outline weight settings to your liking

### Step 4 | Add the FloatAnimation script
- Add a new script, and name it `FloatAnimation`
- In the Github Repository, copy and paste the FloatAnimation script in the Scripts folder into your script
- On your object, add the `FloatAnimation` script component to it
- Adjust the Bob Height, Bob  Speed, and Rotate Speed values in the Inspector to your liking

## How it Works
`InteractableManipulation` handles all drag logic out of the box, so there's no drag scripting needed. `FloatAnimation` drives the idle bob and rotation and pauses itself when the object is held. This animation is reusable on any object!

---

# Part 2 | Chaining Objects

Three objects connected as a chain using physics constraints. Grab the top one and the whole chain dangles and swings with real physics. Let go and everything floats back in place.

## Scene Setup
Start by making an empty scene object called 'Chaining Objects', and add the following objects within this object to keep things organized!

### Step 1 | Create your three objects
1. Drag 3 spheres into your Scene Object
2. Name them `Sphere1`, `Sphere2`, `Sphere3`
3. Position them vertically one above the other in the scene (in order)

### Step 2 | Set up Sphere1 (top anchor)
- Click `Add Component` → `Physics Body`
   - Check `Dynamic`
   - Set Damping to `0.9`
   - Set Angular Damping to `0.9`
- Click `Add Component` → `Interactable`
- Click `Add Component` → `InteractableManipulation`
- Click `Add Component` → `InteractableOutlineFeedback`
   - Add Sphere1's Render Mesh Visual to the Mesh Visuals list
- Click `Add Component` → `FloatAnimation`
   - Script should be there from the previous part

### Step 3 | Set up Sphere2 (middle link)
1. Click `Add Component` → `Physics Body`
   - Check `Dynamic`
   - Set Damping to `0.9`
   - Set Angular Damping to `0.9`
2. On the Physics Body component click `Add Constraint Object`
   - A Constraint child object will appear in the hierarchy under Sphere2
   - Select it and in the Inspector set:
     - Target: `Sphere1 : Physics Body`
     - Constraint Type: `Point`

### Step 4 — Set up Sphere3 (bottom link)
1. Click `Add Component` → `Physics Body`
   - Check `Dynamic`
   - Set Damping to `0.9`
   - Set Angular Damping to `0.9`
2. On the Physics Body component click `Add Constraint Object`
   - Select the Constraint child and in the Inspector set:
     - Target: `Sphere2 : Physics Body`
     - Constraint Type: `Point`

## How It Works
- All 3 spheres float in zero gravity by default
- Grabbing Sphere1 activates real gravity so the chain dangles and swings naturally
- The Point constraints act like real chain links
- This same pattern works for any multi-part object: a character, a mobile, a wind chime, or a product with hanging tags.

