import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, finalize } from 'rxjs';
import { SliderService } from 'src/app/shared/service/slider.service';
import { Slider } from 'src/app/shared/tables/slider';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-list-slider',
  templateUrl: './list-slider.component.html',
  styleUrls: ['./list-slider.component.scss']
})
export class ListSliderComponent implements OnInit {
  sliders: Slider[] = [];
  sliderImage: File;
  sliderChoosenId: number
  sliderAction: string = '';
  uploaded: boolean = false;

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      }
    }
  }

  downloadURL: Observable<string>
  // sliderObjects: Array<Object> = [];

  constructor(private sliderService: SliderService,
    private modalService: BsModalService,
    private storage: AngularFireStorage) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.sliderService.getAllSliders().subscribe({
      next: (sliders) => {
        this.sliders = sliders
      }
    })
  }

  openAddModal() {
    this.layer1 = this.modalService.show(this.chooseNewImage, { class: 'modal-sm' });
  }

  openDeleteModal(id: number) {
    this.sliderChoosenId = id;
    this.layer1 = this.modalService.show(this.deleteImage, { class: 'modal-sm' });
  }

  onFileSelected(event) {
    this.uploaded = true;
    this.sliderImage = event.target.files[0];
  }

  uploadSliderImage(fileUpload: File): Promise<string> {
    this.uploaded = false;
    return new Promise<string>((resolve) => {
      let n = Date.now();
      const filePath = `Admin/Sliders/${n}`;

      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`Admin/Sliders/${n}`, fileUpload);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                resolve(url);
              }
            });
          })
        )
        .subscribe(url => {

        }
        );
    })
  }

  //Modal
  @ViewChild('chooseNewImage') chooseNewImage: TemplateRef<any>;
  @ViewChild('deleteImage') deleteImage: TemplateRef<any>;
  @ViewChild('uploadSuccess') uploadSuccess: TemplateRef<any>;

  layer1: BsModalRef;

  uploadImage() {
    if (this.uploaded) {
      const newSlider = new Slider();
      this.uploadSliderImage(this.sliderImage).then((url) => {
        newSlider.id = 0;
        newSlider.imageUrl = url;
        this.sliderService.createNewSlider(newSlider).subscribe({
          next: () => {
            this.layer1.hide();
            this.sliderAction = 'Thêm'
            this.layer1 = this.modalService.show(this.uploadSuccess, { class: 'modal-sm' });
          }
        })
      })
    }
    else {
      this.layer1.hide();
    }
  }

  deleteChooseImage() {
    this.layer1.hide()
    this.sliderService.deleteSlider(this.sliderChoosenId).subscribe(() => {

    });
    this.sliderAction = 'Xoá'
    this.layer1 = this.modalService.show(this.uploadSuccess, { class: 'modal-sm' });
  }

  closeLayer1() {
    this.layer1.hide();
    this.loadData();
  }


}
