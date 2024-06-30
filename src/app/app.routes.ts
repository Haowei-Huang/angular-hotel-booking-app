import { Routes } from '@angular/router';
import { ClientHomeComponent } from './client-home/client-home.component';
import { ClientBookingComponent } from './client-booking/client-booking.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardManageUsersComponent } from './dashboard-manage-users/dashboard-manage-users.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { authGuard } from './auth.guard';
import { userGuard } from './user.guard';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';
import { ClientViewBookingsComponent } from './client-view-bookings/client-view-bookings.component';
import { nonAdminGuard } from './non-admin.guard';
import { ClientViewBookingsDetailsComponent } from './client-view-bookings-details/client-view-bookings-details.component';
import { DashboardManageHotelsComponent } from './dashboard-manage-hotels/dashboard-manage-hotels.component';
import { DashboardViewHotelComponent } from './dashboard-view-hotel/dashboard-view-hotel.component';
import { DashboardManageBookingsComponent } from './dashboard-manage-bookings/dashboard-manage-bookings.component';
import { DashboardViewBookingComponent } from './dashboard-view-booking/dashboard-view-booking.component';
import { ClientProfileDetailsComponent } from './client-profile-details/client-profile-details.component';
import { ClientProfileCardInfoComponent } from './client-profile-card-info/client-profile-card-info.component';
import { ClientProfileClientInfoComponent } from './client-profile-client-info/client-profile-client-info.component';
export const routes: Routes = [

    { path: 'hotels', component: HotelListComponent, pathMatch: 'full' },
    {
        path: 'hotels/:id', component: HotelDetailsComponent,
    },
    {
        path: 'hotels/:id/booking', component: ClientBookingComponent,
        canActivate: [nonAdminGuard]
    },
    {
        path: 'myBookings', component: ClientViewBookingsComponent,
        canActivate: [userGuard]
    },
    {
        path: 'myBookings/:id', component: ClientViewBookingsDetailsComponent,
        canActivate: [userGuard]
    },
    {
        path: 'profile', component: ClientProfileComponent,
        canActivate: [userGuard],
        children: [
            { path: 'clientInfo', component: ClientProfileClientInfoComponent },
            { path: 'cardInfo', component: ClientProfileCardInfoComponent },
            { path: 'changePassword', component: ChangePasswordComponent },
            { path: '', component: ClientProfileDetailsComponent }
        ]
    },
    {
        path: 'dashboard', component: DashboardComponent,
        canActivate: [authGuard],
        children: [
            { path: 'manageUsers', component: DashboardManageUsersComponent },
            { path: 'manageHotels/:id', component: DashboardViewHotelComponent },
            { path: 'manageHotels', component: DashboardManageHotelsComponent },
            { path: 'manageBookings/:id', component: DashboardViewBookingComponent },
            { path: 'manageBookings', component: DashboardManageBookingsComponent },
            { path: 'changePassword', component: ChangePasswordComponent },
            { path: '', component: DashboardHomeComponent }
        ]
    },
    { path: '', component: ClientHomeComponent },
];