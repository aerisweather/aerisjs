function sort(list) {
  const res = list.slice(0);
  const length = res.length;

  console.log(`sorting ${list}`);

  for (var iPointer = 0; iPointer < length - 1; iPointer++) {
    // walk through array, until we find a new minimum
    var iMin = iPointer;
    for (var i = iPointer + 1; i < length; i++) {
      if (list[i] < list[iMin]) {
        iMin = i;
      }
    }

    if (iMin !== iPointer) {
      // swap iMin with iPointer...
      var pointerItem = list[iPointer];
      var minItem = list[iMin];
      console.log(`swapping ${list[iMin]} with ${pointerItem}`);

      // Remove item at iPointer
      //mapView.overlayMapTypes.removeAt(iPointer);
      //list.splice(iPointer, 1);

      // Add minItem at iPointer
      //mapView.overlayMapTypes.insertAt(iPointer, list[iMin]);
      list.splice(iPointer, 1, minItem);

      // Remove minItem from previous spot
      //mapView.overlayMapTypes.removeAt(iMin);
      //list.splice(iMin, 1);

      // Put iPointer where minItem was
      //mapView.overlayMapTypes.setAt(iMin, jView);
      list.splice(iMin, 1, pointerItem);
    }
  }

  return list;
}

console.log('res: ', sort([3, 2, 1]));
console.log('res: ', sort([1, 3, 7, 9, 2, 6, 8, 3]));
