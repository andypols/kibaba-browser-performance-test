export default class SystemCpuStats {
  collect(usage) {
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
}

