/**
 * Importing
 */
const fs = require('fs');
const express = require('express');
const uuidv4 = require('uuid');

/**
 * Creating Main App
 */
const app = express();

/**
 * File System Reading
 */
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf8')
);

/**
 * MIDDLEWARE
 */
app.use(express.json());

/**
 * REQUEST HANDLERS
 */
app.get('/api/v1/tours', (request, response) => {
  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (request, response) => {
  const newId = uuidv4.v4();

  const newTour = { id: newId, ...request.body };
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      response.status(201).json({
        status: 'success',
        results: tours.length,
        data: {
          newTour,
        },
      });
    }
  );
});
// => /api/v1/tours/:id you have to spesify id
// => /api/v1/tours/:id? now it is optional to spesify id

app.get('/api/v1/tours/:id', (request, response) => {
  const tour = tours.find((el) => {
    return el.id.toString() === request.params.id.toString();
  });
  tour
    ? response.status(200).send({
        status: 'success',
        result: tour === '' ? 0 : 1,
        data: {
          tour,
        },
      })
    : response.status(400).send({
        status: 'fail',
        message: 'there is no such a tour..',
      });
});

/**
 * PORTS
 */
app.listen(3000, () => {
  console.log('app running');
});
