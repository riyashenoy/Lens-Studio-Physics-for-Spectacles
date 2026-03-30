@component
export class ChainLink extends BaseScriptComponent {

    @input followSpeed: number = 15.0
    @input damping: number = 8.0

    private objectTransform: Transform
    private parentTransform: Transform
    private velocity: vec3 = vec3.zero()
    private active: boolean = false
    private restOffset: vec3

    onAwake() {
        this.objectTransform = this.getSceneObject().getTransform()
        this.createEvent("UpdateEvent").bind(() => this.onUpdate())
    }

    enable() {
        this.parentTransform = this.getSceneObject().getParent().getTransform()
        const parentScale = this.parentTransform.getWorldScale()
        const myScale = this.objectTransform.getWorldScale()
        this.restOffset = new vec3(0, -parentScale.y * 0.5 - myScale.y * 0.5, 0)
        this.active = true
    }

    private onUpdate() {
        if (!this.active || !this.parentTransform) return

        const dt = getDeltaTime()
        const targetPos = this.parentTransform.getWorldPosition().add(this.restOffset)
        const currentPos = this.objectTransform.getWorldPosition()

        const spring = targetPos.sub(currentPos).uniformScale(this.followSpeed)

        this.velocity = this.velocity.add(spring.uniformScale(dt))
        this.velocity = this.velocity.uniformScale(1.0 - this.damping * dt)

        this.objectTransform.setWorldPosition(currentPos.add(this.velocity.uniformScale(dt)))
    }
}