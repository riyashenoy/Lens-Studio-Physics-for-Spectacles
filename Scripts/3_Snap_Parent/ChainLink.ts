@component
export class ChainLink extends BaseScriptComponent {

    @input swingStrength: number = 5.0
    @input damping: number = 3.0
    @input velocityInfluence: number = 2.0

    private objectTransform: Transform
    private parentTransform: Transform
    private velocity: vec3 = vec3.zero()
    private active: boolean = false
    private restOffset: vec3

    private lastParentPos: vec3 = vec3.zero()
    private parentVelocity: vec3 = vec3.zero()

    onAwake() {
        this.objectTransform = this.getSceneObject().getTransform()
        this.createEvent("UpdateEvent").bind(() => this.onUpdate())
    }

    enable() {
        this.parentTransform = this.getSceneObject().getParent().getTransform()
        const parentScale = this.parentTransform.getWorldScale()
        const myScale = this.objectTransform.getWorldScale()
        this.restOffset = new vec3(0, -parentScale.y * 0.5 - myScale.y * 0.5, 0)
        this.lastParentPos = this.parentTransform.getWorldPosition()
        this.active = true
    }

    private onUpdate() {
        if (!this.active || !this.parentTransform) return

        const dt = getDeltaTime()
        const parentPos = this.parentTransform.getWorldPosition()

        // Calculate how fast and in what direction the parent is moving
        this.parentVelocity = parentPos.sub(this.lastParentPos).uniformScale(1.0 / dt)
        this.lastParentPos = parentPos

        const targetPos = parentPos.add(this.restOffset)
        const currentPos = this.objectTransform.getWorldPosition()

        // Spring pulls child toward rest position
        const spring = targetPos.sub(currentPos).uniformScale(this.swingStrength)

        // Parent movement kicks the child in the opposite direction (lag/inertia)
        const inertia = this.parentVelocity.uniformScale(-this.velocityInfluence)

        // Gravity
        const gravity = new vec3(0, -2.0, 0)

        this.velocity = this.velocity.add(spring.add(inertia).add(gravity).uniformScale(dt))
        this.velocity = this.velocity.uniformScale(1.0 - this.damping * dt)

        this.objectTransform.setWorldPosition(currentPos.add(this.velocity.uniformScale(dt)))
    }
}