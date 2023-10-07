import { UserActivityTracker } from './UserActivityTracker' // Adjust the import path as needed

describe('UserActivityTracker', () => {
  let tracker

  beforeEach(() => {
    // Create a new UserActivityTracker instance with some mock options
    tracker = new UserActivityTracker({
      activityThresholdMs: 1000, // Adjust these values as needed for your tests
      pollingIntervalMs: 500,
    })
  })

  afterEach(() => {
    // Clean up the tracker after each test
    tracker.destroy()
  })

  it('should be inactive initially', () => {
    expect(tracker.isActive()).toBe(false)
  })

  it('should become active on user activity', () => {
    // Simulate user activity
    document.dispatchEvent(new MouseEvent('mousemove'))
    expect(tracker.isActive()).toBe(true)
  })

  it('should become inactive after a period of inactivity', () => {
    // Simulate user activity to make it active
    document.dispatchEvent(new MouseEvent('mousemove'))

    // Wait for some time to exceed the activityThresholdMs
    jest.advanceTimersByTime(2000) // Adjust the time as needed

    expect(tracker.isActive()).toBe(false)
  })

  it('should trigger the activityChangeCallback when activity status changes', () => {
    const callback = jest.fn()
    tracker.setActivityChangeCallback(callback)

    // Simulate user activity to make it active
    document.dispatchEvent(new MouseEvent('mousemove'))

    // Wait for some time to exceed the activityThresholdMs
    jest.advanceTimersByTime(2000) // Adjust the time as needed

    expect(callback).toHaveBeenCalledWith(false)
  })

  it('should stop tracking after calling destroy', () => {
    tracker.destroy()

    // Simulate user activity after destroy
    document.dispatchEvent(new MouseEvent('mousemove'))

    // Wait for some time to exceed the activityThresholdMs
    jest.advanceTimersByTime(2000) // Adjust the time as needed

    expect(tracker.isActive()).toBe(false)
  })
})
