export function* bubbleSort(array) {
  const arr = [...array]
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      yield { array: [...arr], comparing: [j, j + 1] }
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        yield { array: [...arr], swapping: [j, j + 1] }
      }
    }
  }
  yield { array: [...arr], done: true }
}

export function* selectionSort(array) {
  const arr = [...array]
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i
    for (let j = i + 1; j < arr.length; j++) {
      yield { array: [...arr], comparing: [minIdx, j] }
      if (arr[j] < arr[minIdx]) minIdx = j
    }
    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      yield { array: [...arr], swapping: [i, minIdx] }
    }
  }
  yield { array: [...arr], done: true }
}

export function* insertionSort(array) {
  const arr = [...array]
  for (let i = 1; i < arr.length; i++) {
    let j = i
    while (j > 0 && arr[j - 1] > arr[j]) {
      yield { array: [...arr], comparing: [j - 1, j] }
      ;[arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
      yield { array: [...arr], swapping: [j, j - 1] }
      j--
    }
  }
  yield { array: [...arr], done: true }
}

export function* mergeSort(array) {
  const arr = [...array]
  yield* mergeSortHelper(arr, 0, arr.length - 1)
  yield { array: [...arr], done: true }
}

function* mergeSortHelper(arr, l, r) {
  if (l >= r) return
  const m = Math.floor((l + r) / 2)
  yield* mergeSortHelper(arr, l, m)
  yield* mergeSortHelper(arr, m + 1, r)
  yield* mergeHelper(arr, l, m, r)
}

function* mergeHelper(arr, l, m, r) {
  const left = arr.slice(l, m + 1)
  const right = arr.slice(m + 1, r + 1)
  let i = 0, j = 0, k = l
  while (i < left.length && j < right.length) {
    yield { array: [...arr], comparing: [l + i, m + 1 + j] }
    if (left[i] <= right[j]) arr[k++] = left[i++]
    else arr[k++] = right[j++]
    yield { array: [...arr], swapping: [k - 1] }
  }
  while (i < left.length) { arr[k++] = left[i++]; yield { array: [...arr], swapping: [k - 1] } }
  while (j < right.length) { arr[k++] = right[j++]; yield { array: [...arr], swapping: [k - 1] } }
}

export function* quickSort(array) {
  const arr = [...array]
  yield* quickSortHelper(arr, 0, arr.length - 1)
  yield { array: [...arr], done: true }
}

function* quickSortHelper(arr, lo, hi) {
  if (lo >= hi) return
  let pivot = arr[hi], i = lo
  for (let j = lo; j < hi; j++) {
    yield { array: [...arr], comparing: [j, hi] }
    if (arr[j] < pivot) {
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      yield { array: [...arr], swapping: [i, j] }
      i++
    }
  }
  ;[arr[i], arr[hi]] = [arr[hi], arr[i]]
  yield { array: [...arr], swapping: [i, hi] }
  yield* quickSortHelper(arr, lo, i - 1)
  yield* quickSortHelper(arr, i + 1, hi)
}