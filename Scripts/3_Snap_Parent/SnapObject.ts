import { Interactable } from 'SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable'
import { DragInteractorEvent } from 'SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent'
import { InteractorInputType } from 'SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor'
import { ChainLink } from './ChainLink'

@component
export class SnapObject extends BaseScriptComponent {

    @input snapRadius: number = 5
    @input snapTargets: SceneObject[] = []

    private objectTransform: Transform
    private interactable: Interactable
    private isSnapped: boolean = false
    private hasChild: boolean = false
    private dragOffset: vec3

    onAwake() {
        this.objectTransform = this.getSceneObject().getTransform()
        this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName()) as Interactable
        this.createEvent("OnStartEvent").bind(() => this.onStart())
    }

    private onStart() {
        if (this.interactable) this.setupEvents()
    }

    private getInteractorPosition(event: DragInteractorEvent): vec3 {
        const isDirect =
            event.interactor.inputType === InteractorInputType.LeftHand ||
            event.interactor.inputType === InteractorInputType.RightHand
        return isDirect ? event.interactor.startPoint : event.interactor.endPoint
    }

    private getBottomPoint(): vec3 {
        const pos = this.objectTransform.getWorldPosition()
        const scale = this.objectTransform.getWorldScale()
        return new vec3(pos.x, pos.y - scale.y * 0.5, pos.z)
    }

    private getSocketPoint(obj: SceneObject): vec3 {
        const t = obj.getTransform()
        const pos = t.getWorldPosition()
        const scale = t.getWorldScale()
        return new vec3(pos.x, pos.y - scale.y * 0.5, pos.z)
    }

    private getTopPoint(): vec3 {
        const pos = this.objectTransform.getWorldPosition()
        const scale = this.objectTransform.getWorldScale()
        return new vec3(pos.x, pos.y + scale.y * 0.5, pos.z)
    }

    getIsSnapped(): boolean {
        return this.isSnapped
    }

    getHasChild(): boolean {
        return this.hasChild
    }

    setHasChild(val: boolean) {
        this.hasChild = val
    }

    private trySnap() {
        if (this.isSnapped) return

        for (const target of this.snapTargets) {
            if (target === this.getSceneObject()) continue

            const targetSnap = target.getComponent(SnapObject.getTypeName()) as SnapObject
            if (!targetSnap) continue

            if (targetSnap.getHasChild()) continue

            const socketPoint = this.getSocketPoint(target)
            const myTop = this.getTopPoint()
            const dist = socketPoint.distance(myTop)

            if (dist < this.snapRadius) {
                this.snapTo(target, targetSnap, socketPoint)
                return
            }
        }
    }

    private snapTo(target: SceneObject, targetSnap: SnapObject, socketPoint: vec3) {
        this.isSnapped = true
        targetSnap.setHasChild(true)

        const worldScale = this.objectTransform.getWorldScale()
        const newPos = new vec3(socketPoint.x, socketPoint.y - worldScale.y * 0.5, socketPoint.z)

        this.getSceneObject().setParent(target)

        this.objectTransform.setWorldScale(worldScale)
        this.objectTransform.setWorldPosition(newPos)

        const chainLink = this.getSceneObject().getComponent(ChainLink.getTypeName()) as ChainLink
        if (chainLink) chainLink.enable()

        print(this.getSceneObject().name + " snapped to " + target.name)
    }

    private onDragStart(event: DragInteractorEvent) {
        if (this.isSnapped) return
        this.dragOffset = this.objectTransform.getWorldPosition().sub(this.getInteractorPosition(event))
    }

    private onDragUpdate(event: DragInteractorEvent) {
        if (this.isSnapped) return
        this.objectTransform.setWorldPosition(this.getInteractorPosition(event).add(this.dragOffset))
        this.trySnap()
    }

    private onDragEnd() {}

    private setupEvents() {
        this.interactable.onDragStart.add((e: DragInteractorEvent) => this.onDragStart(e))
        this.interactable.onDragUpdate.add((e: DragInteractorEvent) => this.onDragUpdate(e))
        this.interactable.onDragEnd.add(() => this.onDragEnd())
    }
}