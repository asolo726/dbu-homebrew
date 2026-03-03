class ProgressBar {
  constructor(
    label,
    currentProgress,
    textColor,
    segmentColor,
    pageProgress,
    pageCountOverride = null, // If this value is provided, it will be used instead of the actual page count for progress calculations (useful for sections with unknown or variable page counts)
  ) {
    this._label = label;
    this._currentProgress = currentProgress;
    this._textColor = textColor;
    this._segmentColor = segmentColor;
    this._pageProgress = pageProgress;
    this._pageCountOverride = pageCountOverride;
  }

  get label() {
    return this._label;
  }
  get currentProgress() {
    return this._currentProgress;
  }
  get textColor() {
    return this._textColor;
  }
  get segmentColor() {
    return this._segmentColor;
  }
  get pageProgress() {
    return this._pageProgress;
  }
  get pageCountOverride() {
    return this._pageCountOverride;
  }
  set label(value) {
    this._label = value;
  }
  set currentProgress(value) {
    this._currentProgress = value;
  }
  set textColor(value) {
    this._textColor = value;
  }
  set segmentColor(value) {
    this._segmentColor = value;
  }
  set pageProgress(value) {
    this._pageProgress = value;
  }
  set pageCountOverride(value) {
    this._pageCountOverride = value;
  }
}

export default ProgressBar;