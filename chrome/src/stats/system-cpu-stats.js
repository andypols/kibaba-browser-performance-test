export default class SystemCpuStats {
  constructor() {
    this.previousProcessorValues = []
  }

  asPercentage(usage) {
    const totals = usage.reduce((acc, core) => {
      return {
        total: acc.total + core.total,
        idle: acc.idle + core.idle / core.total,
        user: acc.user + core.user / core.total,
        kernel: acc.kernel + core.kernel / core.total,
      }
    }, {idle: 0, user: 0, total: 0, kernel: 0})

    return {
      idlePct: (totals.idle / usage.length) * 100,
      kernelPct: (totals.kernel / usage.length) * 100,
      userPct: (totals.user / usage.length) * 100
    }
  }

  getCpuUsage(processors) {
    const usage = []

    for(let i = 0; i < processors.length; i++) {
      const processor = processors[i]

      // data is cumulative, so have to calculate the difference.
      if(processor.total !== 0) {
        const previousValue = this.previousProcessorValues[i];
        usage.push(
          previousValue
            ? {
              user: processor.user - previousValue.user,
              kernel: processor.kernel - previousValue.kernel,
              idle: processor.idle - previousValue.idle,
              total: processor.total - previousValue.total,
            }
            : processor,
        )
      }
    }

    return usage
  }

  async collect() {
    const cpu = await new Promise(resolve => chrome.system['cpu'].getInfo(resolve));

    const processors = cpu.processors.map(({usage}) => usage);
    const cpuDeltaUsage = this.getCpuUsage(processors);
    this.previousProcessorValues = processors

    return this.asPercentage(cpuDeltaUsage);
  }
}

