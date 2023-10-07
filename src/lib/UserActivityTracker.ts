import { UserActivityTrackerOptions } from './interface'

export class UserActivityTracker {
  private active: boolean = false
  private lastActivityTimestamp: number = Date.now()
  private activityThresholdMs: number
  private pollingIntervalMs: number
  private activityCheckTimer: any
  private activityChangeCallback?: (isActive: boolean) => void

  constructor(options: UserActivityTrackerOptions) {
    this.activityThresholdMs = options.activityThresholdMs
    this.pollingIntervalMs = options.pollingIntervalMs || 1000
    this.startTracking()
  }

  private startTracking(): void {
    document.addEventListener('mousemove', this.onActivity)
    document.addEventListener('keydown', this.onActivity)
    window.addEventListener('focus', this.onActivity)

    // Start polling for activity status
    this.pollActivityStatus()
  }

  private stopTracking(): void {
    document.removeEventListener('mousemove', this.onActivity)
    document.removeEventListener('keydown', this.onActivity)
    window.removeEventListener('focus', this.onActivity)

    // Clear the debounce timer and polling timer when stopping tracking
    if (this.activityCheckTimer) {
      clearInterval(this.activityCheckTimer)
    }
  }

  private onActivity = () => {
    this.lastActivityTimestamp = Date.now()
    this.setActive(true)
  }

  private pollActivityStatus() {
    this.activityCheckTimer = setInterval(() => {
      const currentTime = Date.now()
      if (currentTime - this.lastActivityTimestamp < this.activityThresholdMs) {
        this.setActive(true)
      } else {
        this.setActive(false)
      }
    }, this.pollingIntervalMs)
  }

  private setActive(isActive: boolean): void {
    if (this.active !== isActive) {
      this.active = isActive
      if (this.activityChangeCallback) {
        this.activityChangeCallback(isActive)
      }
    }
  }

  isActive(): boolean {
    return this.active
  }

  setActivityChangeCallback(callback: (isActive: boolean) => void): void {
    this.activityChangeCallback = callback
  }

  destroy(): void {
    this.stopTracking()
  }
}
