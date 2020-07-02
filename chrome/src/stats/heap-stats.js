export default class HeapStats {
  async collect() {
    const {totalJSHeapSize, usedJSHeapSize, jsHeapSizeLimit} = window.performance.memory;

    return {
      totalJSHeapSize,
      totalJSHeapSizePct: (totalJSHeapSize / jsHeapSizeLimit) * 100,
      usedJSHeapSize,
      usedJSHeapSizePct: (usedJSHeapSize / jsHeapSizeLimit) * 100,
      jsHeapSizeLimit,
    }
  }
}

