export default class HeapStats {
  collect() {
    const {totalJSHeapSize, usedJSHeapSize, jsHeapSizeLimit} = window.performance.memory;

    return Promise.resolve({
      totalJSHeapSize,
      totalJSHeapSizePct: (totalJSHeapSize / jsHeapSizeLimit) * 100,
      usedJSHeapSize,
      usedJSHeapSizePct: (usedJSHeapSize / jsHeapSizeLimit) * 100,
      jsHeapSizeLimit,
    });
  }
}

