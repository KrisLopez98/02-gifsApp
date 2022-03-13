import { HttpClient, HttpParams } from '@angular/common/http';
import { jsDocComment } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey:      string = '3CEiI3nvMcSbZuZqTVbJj35lUgScwYWD';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial:  string[] = [];

  
  public resultados: Gif[] = [];

  get historial(){
    return [...this._historial];
  }

  constructor( private http: HttpClient ){
    //Obtiene la información del LocalStorage con la key "historial"
    this._historial = JSON.parse(localStorage.getItem('historial')!) || []
    
    //Obtiene la información del LocalStorage con la key "resultados"
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || []
  }

  buscarGifs( query: string = ''){

    query = query.trim().toLocaleLowerCase();

    if( !this._historial.includes( query )){
      this._historial.unshift( query );
      this._historial = this._historial.splice(0, 10);

      //Guarda la información en el LocalStorage
      localStorage.setItem('historial', JSON.stringify( this._historial));
    }

    const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('limit', '10')
        .set('q', query);

    console.log(params.toString)

    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`,{ params })
      .subscribe( ( resp )=> {
        console.log( resp.data );
        this.resultados = resp.data;

        //Guarda la información en el LocalStorage
        localStorage.setItem('resultados', JSON.stringify( this.resultados ));
      }) 
  }
}
