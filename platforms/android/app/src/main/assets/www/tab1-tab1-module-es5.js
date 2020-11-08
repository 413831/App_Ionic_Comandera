(function () {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  (window["webpackJsonp"] = window["webpackJsonp"] || []).push([["tab1-tab1-module"], {
    /***/
    "JGGF":
    /*!*******************************************!*\
      !*** ./src/app/pages/tab1/tab1.page.scss ***!
      \*******************************************/

    /*! exports provided: default */

    /***/
    function JGGF(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3RhYjEvdGFiMS5wYWdlLnNjc3MifQ== */";
      /***/
    },

    /***/
    "LhMw":
    /*!*****************************************!*\
      !*** ./src/app/pages/tab1/tab1.page.ts ***!
      \*****************************************/

    /*! exports provided: Tab1Page */

    /***/
    function LhMw(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "Tab1Page", function () {
        return Tab1Page;
      });
      /* harmony import */


      var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! tslib */
      "mrSG");
      /* harmony import */


      var _raw_loader_tab1_page_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! raw-loader!./tab1.page.html */
      "p9Ql");
      /* harmony import */


      var _tab1_page_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./tab1.page.scss */
      "JGGF");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! @ionic/angular */
      "TEn/");
      /* harmony import */


      var src_app_services_codigo_qr_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! src/app/services/codigo-qr.service */
      "qko+");

      var Tab1Page = /*#__PURE__*/function () {
        function Tab1Page(escanerQR, toastController, router) {
          _classCallCheck(this, Tab1Page);

          this.escanerQR = escanerQR;
          this.toastController = toastController;
          this.router = router;
        }

        _createClass(Tab1Page, [{
          key: "escanear",
          value: function escanear() {
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
              var scan;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return this.escanerQR.escanear("Escanee el código QR", 'QR_CODE');

                    case 2:
                      scan = _context.sent;
                      this.procesarQR(scan);

                    case 4:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, this);
            }));
          }
        }, {
          key: "presentToast",
          value: function presentToast(message) {
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
              var toast;
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return this.toastController.create({
                        message: message,
                        duration: 2000
                      });

                    case 2:
                      toast = _context2.sent;
                      toast.present();

                    case 4:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2, this);
            }));
          }
        }, {
          key: "procesarQR",
          value: function procesarQR(scan) {
            var textoQR = scan.text.split(':');
            var entidad = textoQR[1];
            var id = textoQR[2];

            switch (entidad) {
              case 'Mesa':
                this.router.navigate(['/info-mesa', id]);
                break;

              case 'Producto':
                break;

              case 'Ingreso':
                break;
            }
          }
        }]);

        return Tab1Page;
      }();

      Tab1Page.ctorParameters = function () {
        return [{
          type: src_app_services_codigo_qr_service__WEBPACK_IMPORTED_MODULE_6__["CodigoQRService"]
        }, {
          type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["ToastController"]
        }, {
          type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]
        }];
      };

      Tab1Page = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: 'app-tab1',
        template: _raw_loader_tab1_page_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_tab1_page_scss__WEBPACK_IMPORTED_MODULE_2__["default"]]
      })], Tab1Page);
      /***/
    },

    /***/
    "mV/h":
    /*!***************************************************!*\
      !*** ./src/app/pages/tab1/tab1-routing.module.ts ***!
      \***************************************************/

    /*! exports provided: Tab1PageRoutingModule */

    /***/
    function mVH(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "Tab1PageRoutingModule", function () {
        return Tab1PageRoutingModule;
      });
      /* harmony import */


      var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! tslib */
      "mrSG");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var src_app_services_profile_guard_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! src/app/services/profile-guard.service */
      "zNKl");
      /* harmony import */


      var _tab1_page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! ./tab1.page */
      "LhMw");

      var routes = [{
        path: '',
        component: _tab1_page__WEBPACK_IMPORTED_MODULE_4__["Tab1Page"],
        canActivate: [src_app_services_profile_guard_service__WEBPACK_IMPORTED_MODULE_3__["ProfileGuardService"]]
      }];

      var Tab1PageRoutingModule = function Tab1PageRoutingModule() {
        _classCallCheck(this, Tab1PageRoutingModule);
      };

      Tab1PageRoutingModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
      })], Tab1PageRoutingModule);
      /***/
    },

    /***/
    "p9Ql":
    /*!*********************************************************************************!*\
      !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/tab1/tab1.page.html ***!
      \*********************************************************************************/

    /*! exports provided: default */

    /***/
    function p9Ql(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony default export */


      __webpack_exports__["default"] = "<ion-header [translucent]=\"true\">\r\n  <ion-toolbar color=\"dark\">\r\n    <ion-title>\r\n      Test\r\n    </ion-title>\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content [fullscreen]=\"true\" color=\"dark\">\r\n  <ion-header collapse=\"condense\">\r\n    <ion-toolbar>\r\n      <ion-title size=\"large\">Botones para prueba</ion-title>\r\n    </ion-toolbar>\r\n  </ion-header>\r\n\r\n\r\n  <ion-list color=\"dark\">\r\n    <ion-list-header>\r\n      <ion-label>Sólo para probar pages</ion-label>\r\n    </ion-list-header>\r\n\r\n    <ion-item>\r\n      <ion-button routerLink=\"/home/menu-mesa\" expand=\"block\" fill=\"clear\" shape=\"round\">\r\n        Menú mesa\r\n      </ion-button>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-button routerLink=\"/home/menu-cliente\" expand=\"block\" fill=\"clear\" shape=\"round\">\r\n        Menú Cliente\r\n      </ion-button>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-button routerLink=\"/home/menu-empleado\" expand=\"block\" fill=\"clear\" shape=\"round\">\r\n        Menú Empleado\r\n      </ion-button>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-button routerLink=\"/home/menu-jefe\" expand=\"block\" fill=\"clear\" shape=\"round\">\r\n        Menú Jefe\r\n      </ion-button>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-button routerLink=\"/home/menu-producto\" expand=\"block\" fill=\"clear\" shape=\"round\">\r\n        Menú producto\r\n      </ion-button>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-button routerLink=\"/home/menu-pedidos\" expand=\"block\" fill=\"clear\" shape=\"round\">\r\n        Menú Pedido\r\n      </ion-button>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-button routerLink=\"/home/qr-ingreso-local\" expand=\"block\" fill=\"clear\" shape=\"round\">\r\n        Qr ingreso al local\r\n      </ion-button>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-button routerLink=\"/home/menu-reserva\" expand=\"block\" fill=\"clear\" shape=\"round\">\r\n        Menú reserva\r\n      </ion-button>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-button routerLink=\"/login\" expand=\"block\" fill=\"clear\" shape=\"round\">\r\n        Iniciar Sesión\r\n      </ion-button>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-button routerLink=\"/register\" expand=\"block\" fill=\"clear\" shape=\"round\">\r\n        Registro\r\n      </ion-button>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-button routerLink=\"/home/lista-de-espera\" expand=\"block\" fill=\"clear\" shape=\"round\">\r\n        Lista de Espera\r\n      </ion-button>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-button routerLink=\"/home/info-ingreso\" expand=\"block\" fill=\"clear\" shape=\"round\">\r\n        Info-ingreso\r\n      </ion-button>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-button routerLink=\"/home/info-mesa/1\" expand=\"block\" fill=\"clear\" shape=\"round\">\r\n        Info-mesa\r\n      </ion-button>\r\n    </ion-item>\r\n\r\n  </ion-list>\r\n  <!--  -->\r\n\r\n</ion-content>";
      /***/
    },

    /***/
    "uMfO":
    /*!*******************************************!*\
      !*** ./src/app/pages/tab1/tab1.module.ts ***!
      \*******************************************/

    /*! exports provided: Tab1PageModule */

    /***/
    function uMfO(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "Tab1PageModule", function () {
        return Tab1PageModule;
      });
      /* harmony import */


      var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! tslib */
      "mrSG");
      /* harmony import */


      var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @ionic/angular */
      "TEn/");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/common */
      "ofXK");
      /* harmony import */


      var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/forms */
      "3Pt+");
      /* harmony import */


      var _tab1_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! ./tab1.page */
      "LhMw");
      /* harmony import */


      var _explore_container_explore_container_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! ../explore-container/explore-container.module */
      "HGan");
      /* harmony import */


      var _tab1_routing_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
      /*! ./tab1-routing.module */
      "mV/h");

      var Tab1PageModule = function Tab1PageModule() {
        _classCallCheck(this, Tab1PageModule);
      };

      Tab1PageModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
        imports: [_ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonicModule"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], _explore_container_explore_container_module__WEBPACK_IMPORTED_MODULE_6__["ExploreContainerComponentModule"], _tab1_routing_module__WEBPACK_IMPORTED_MODULE_7__["Tab1PageRoutingModule"]],
        declarations: [_tab1_page__WEBPACK_IMPORTED_MODULE_5__["Tab1Page"]]
      })], Tab1PageModule);
      /***/
    }
  }]);
})();
//# sourceMappingURL=tab1-tab1-module-es5.js.map