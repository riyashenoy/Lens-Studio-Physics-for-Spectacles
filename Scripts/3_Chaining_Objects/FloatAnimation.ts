import { Interactable } from 'SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable'

// FloatAnimation makes any object hover in place, bob up and down, and slowly rotate
// It pauses the animation while the object is being held so it doesn't fight the user's hand
// When released, it saves the new position and resumes floating from there

@component
export class FloatAnimation extends BaseScriptComponent {

    // How far the object moves up and down in world units
    @input bobHeight: number = 0.05

    // How fast the object bobs up and down
    @input bobSpeed: number = 1.5

    // How many degrees per second the object rotates
    @input rotateSpeed: number = 30

    private objectTransform: Transform
    private interactable: Interactable

    // The Y position the bob animates around - updates when the object is dropped
    private basePosition: vec3

    // Tracks elapsed time to drive the sine wave bob
    private time: number = 0

    // Pauses the animation while the user is holding the object
    private isHeld: boolean = false

    onAwake() {
        this.objectTransform = this.getSceneObject().getTransform()
        this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName()) as Interactable

        // Save the starting position as the base for the bob animation
        this.basePosition = this.objectTransform.getWorldPosition()

        this.createEvent("OnStartEvent").bind(() => this.onStart())
        this.createEvent("UpdateEvent").bind(() => this.onUpdate())
    }

    private onStart() {
        if (this.interactable) {
            // Pause animation when the user pinches or clicks the object
            this.interactable.onTriggerStart.add(() => {
                this.isHeld = true
            })

            // Resume animation when released and save the new drop position
            this.interactable.onTriggerEnd.add(() => {
                this.isHeld = false
                this.basePosition = this.objectTransform.getWorldPosition()
            })

            // Same as above but handles the case where the user releases outside the object
            this.interactable.onTriggerEndOutside.add(() => {
                this.isHeld = false
                this.basePosition = this.objectTransform.getWorldPosition()
            })
        }
    }

    private onUpdate() {
        // Skip animation entirely while the object is being held
        if (this.isHeld) return

        // Accumulate time each frame to feed into the sine wave
        this.time += getDeltaTime()

        // Bob up and down using a sine wave offset from the base position
        // Math.sin produces a value between -1 and 1, scaled by bobHeight
        const pos = this.objectTransform.getWorldPosition()
        pos.y = this.basePosition.y + Math.sin(this.time * this.bobSpeed) * this.bobHeight
        this.objectTransform.setWorldPosition(pos)

        // Rotate around the Y axis at a constant speed
        // getDeltaTime ensures the rotation is frame-rate independent
        const degrees = this.rotateSpeed * getDeltaTime()
        const rot = this.objectTransform.getLocalRotation()
        this.objectTransform.setLocalRotation(
            quat.angleAxis(degrees * (Math.PI / 180), vec3.up()).multiply(rot)
        )
    }
}