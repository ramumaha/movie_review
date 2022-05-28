import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute,Params } from '@angular/router';
import { Review } from 'src/app/reviews/review.model';
import { reviewSerivce } from 'src/app/reviews/reviews.service';
import { SearchService } from 'src/app/search/search.service';
import { WatchListService } from 'src/app/watchlist/watchlist.service';
import {FlashMessagesService} from 'angular2-flash-messages';


@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
   @Input()id:any;
   @Input() movie:any;
   isActive:boolean;
   reviews:Review[]=[];

  constructor(private route:ActivatedRoute,
    private reviewservice:reviewSerivce,
    private searchservice:SearchService,
    private watchlistservice:WatchListService,
    private flashMessage:FlashMessagesService ) { }

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params:Params)=>{
        this.id=params['id'];
     
      }
    )
    this.loadMovie();
    this.reviewservice.reviewadded.subscribe(
      (reviews:Review[])=>{
        this.reviews=reviews;

      }
      );
    this.reviews=this.reviewservice.displayReview();

   
  }
  loadMovie(){
    this.searchservice.getDetails(this.id).subscribe((data)=>{
      this.movie=data;
      this.searchservice.movieDetails=data;
    }),(err)=>{
      console.log("error");
    }

  }


  toggleColor(){
    this.isActive=!this.isActive; 
    if(this.isActive){
      this.watchlistservice.addmovie(this.movie).subscribe(data=>{
        if(data.ok){
          this.flashMessage.show("Movie Added",{cssClass:'alert-success',timeout:4000});
        }else{
          this.flashMessage.show("Error!!!Try later",{cssClass:'alert-danger',timeout:4000});
        }
        
      })
    }else{
      this.watchlistservice.removemovie(this.movie).subscribe(
        data=>{
          if(data.ok){
            this.flashMessage.show("Movie Removed",{cssClass:'alert-success',timeout:4000});
          }else{
            this.flashMessage.show("Movie not found",{cssClass:'alert-danger',timeout:4000});
          }
          
        }
      )
    }


  }

}
