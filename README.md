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
- Add the `Interactable` Component (it will show up as a .ts)
- Add the `InteractableManipulation` Component (it will show up as a .ts)
- Add the `InteractableOutlineFeedback` Component (it will show up as a .ts)
  - Under `Mesh Visuals` click `Add Value`, and drag your object's `Render Mesh Visual` component into the slot
- Adjust the hovering color and outline weight settings to your liking

### Step 4 | Add the FloatAnimation script
1. Add a new script, and name it `FloatAnimation` 
2. In the Github Repository, copy and paste the FloatAnimation script in the Scripts folder into your script
3. On your object, add the `FloatAnimation` script component to it
4. Adjust the Bob Height, Bob  Speed, and Rotate Speed values in the Inspector to your liking

## How it Works
`InteractableManipulation` handles all drag logic out of the box, so there's no drag scripting needed. `FloatAnimation` drives the idle bob and rotation and pauses itself when the object is held. This pattern, idle animation that pauses on interaction is reusable in any project!

---

