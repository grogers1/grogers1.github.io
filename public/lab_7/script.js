function convertRestaurantsToCategories(restaurantList) {
  // process your restaurants here!
  return restaurantList.reduce((collection, item, i) => {
    const findCat = collection.find((findItem) => findItem.label === item.category
    );
    if (!findCat) {
      collection.push({
        label: item.category,y: 1,});
    } else {
      findCat.y += 1;
    }
    return collection;
  }, []);
}

function makeYourOptionsObject(datapointsFromRestaurantsList) {
  // set your chart configuration here!
  CanvasJS.addColorSet('customColorSet1', [
    // colorSet Array
    "#2F4F4F",
    "#008080",
    "#2E8B57",
    "#3CB371",
    "#90EE90"
  ]); // add an array of colors here https://canvasjs.com/docs/charts/chart-options/colorset/

    return {
      animationEnabled: true,
      colorSet: 'customColorSet1',
      title: {
        text: 'Places To Eat Out In Future',
      },
      axisX: {
        interval: 1,
        labelFontSize: 12,
      },
      axisY2: {
        interlacedColor: 'rgba(1,77,101,.2)',
        gridColor: 'rgba(1,77,101,.1)',
        title: 'Restaurants By Category',
        labelFontSize: 12,
        scaleBreaks: {
          customBreaks: [
            { startValue: 40, endValue: 50, color: '#EB8CC6' },
            { startValue: 85, endValue: 100, color: '#3EA0DD' },
            { startValue: 140, endValue: 175, color: '#EC5657' },
          ],
        }, // Add your scale breaks here https://canvasjs.com/docs/charts/chart-options/axisy/scale-breaks/custom-breaks/
      },
      data: [
        {
          type: 'bar',
          name: 'restaurants',
          axisYType: 'secondary',
          dataPoints: datapointsFromRestaurantsList,
        },
      ],
    };
}

function runThisWithResultsFromServer(jsonFromServer) {
  console.log('jsonFromServer', jsonFromServer);
  sessionStorage.setItem('restaurantList', JSON.stringify(jsonFromServer)); // don't mess with this, we need it to provide unit testing support
  // Process your restaurants list
  // Make a configuration object for your chart
  // Instantiate your chart
  const newlistforresaurants = convertRestaurantsToCategories(jsonFromServer);
  const catagories = makeYourOptionsObject(newlistforresaurants);
  const elements = new CanvasJS.Chart("chartContainer",catagories);
  elements.render();
}

document.body.addEventListener('submit', async (e) => {
  e.preventDefault(); // this stops whatever the browser wanted to do itself.
  const form = $(e.target).serializeArray();
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form),
  })
    .then((fromServer) => fromServer.json())
    .then((jsonFromServer) => runThisWithResultsFromServer(jsonFromServer))
    .catch((err) => {
      console.log(err);
    });
});
