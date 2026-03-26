import { Interactable } from 'SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable'

// AnchorBody controls the gravity behavior of a chain of physics objects
// By default all objects in the chain float in zero gravity
// When the user grabs the top object, gravity kicks in so the chain dangles naturally
// When released, anti-gravity is applied again and everything floats back in place

@component
export class AnchorBody extends BaseScriptComponent {

    // Drag Sphere2 and Sphere3 (or any chain objects) into this list in the Inspector
    @input chainObjects: SceneObject[] = []

    private interactable: Interactable

    // Stores all physics bodies in the chain including the object this script is on
    private bodies: BodyComponent[] = []

    // Tracks whether the user is currently holding the top object
    private isHeld: boolean = false

    onAwake() {
        this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName()) as Interactable
        this.createEvent("OnStartEvent").bind(() => this.onStart())
        this.createEvent("UpdateEvent").bind(() => this.onUpdate())
    }

    private onStart() {
        // Add this object's own physics body to the list first
        const selfBody = this.getSceneObject().getComponent("Physics.BodyComponent") as BodyComponent
        if (selfBody) this.bodies.push(selfBody)

        // Add the physics body of each connected chain object
        for (const obj of this.chainObjects) {
            const body = obj.getComponent("Physics.BodyComponent") as BodyComponent
            if (body) this.bodies.push(body)
        }

        // Set initial damping on all bodies so they slow down naturally instead of drifting forever
        for (const body of this.bodies) {
            body.intangible = false
            body.damping = 0.9
            body.angularDamping = 0.9
        }

        if (this.interactable) {
            // Mark as held when the user pinches or clicks the top object
            this.interactable.onTriggerStart.add(() => {
                this.isHeld = true
            })

            // Mark as released when the user lets go
            this.interactable.onTriggerEnd.add(() => {
                this.isHeld = false
            })

            // Handles the case where the user releases outside the object bounds
            this.interactable.onTriggerEndOutside.add(() => {
                this.isHeld = false
            })
        }
    }

    private onUpdate() {
        for (const body of this.bodies) {
            if (this.isHeld) {
                // Apply real gravity so the chain links hang and swing below the held object
                // Force = mass * gravity (9.8 m/s2 downward)
                body.addForce(new vec3(0, -9.8 * body.mass, 0), Physics.ForceMode.Force)
            } else {
                // Apply an equal upward force to cancel gravity out, creating a floating effect
                // This runs every frame to continuously counteract the physics engine's gravity
                body.addForce(new vec3(0, 9.8 * body.mass, 0), Physics.ForceMode.Force)
            }
        }
    }
}