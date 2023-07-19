// review / rating / createdAt / ref to tour / ref to user

const { default: mongoose } = require('mongoose');
const { default: slugify } = require('slugify');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
    },
    rating: {
      type: Number,
      // default: 4.5,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user or Author.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Eradicate duplicate reviews (means each user could provide only one review for a tour)
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre('save', function (next) {
  this.slug = slugify(this.review, { lower: true });
  next();
});

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name',
  //   }).populate({
  //     path: 'user',
  //     select: 'name photo',
  //   });
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // this keyword will point to current review
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRationg: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats, '<----stats');

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRationg,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  // this.constructor points to the current review model
  this.constructor.calcAverageRatings(this.tour);
});

// update the AverageRating and Quantity if the Reviews got updated or deleted
// findByIdAndUpdate
// findByIdAndDelete

reviewSchema.post(/^findOneAnd/, async (doc) => {
  // This will execute the method from the current doc instance
  if (doc) await doc.constructor.calcAverageRatings(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
