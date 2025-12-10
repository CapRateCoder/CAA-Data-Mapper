import { ResoFieldDefinition } from './types';
import Papa from 'papaparse';

// Compressed CSV Data - ResourceName,StandardName,DisplayName
// Definition and SimpleDataType removed to save space while maintaining mapping capability
// This data is derived from the RESO Data Dictionary 2.0 provided as Ground Truth.
const RAW_RESO_CSV = `ResourceName,StandardName,DisplayName
Property,AboveGradeFinishedArea,Above Grade Finished Area
Property,AboveGradeFinishedAreaSource,Above Grade Finished Area Source
Property,AboveGradeFinishedAreaUnits,Above Grade Finished Area Units
Property,AboveGradeUnfinishedArea,Above Grade Unfinished Area
Property,AboveGradeUnfinishedAreaSource,Above Grade Unfinished Area Source
Property,AboveGradeUnfinishedAreaUnits,Above Grade Unfinished Area Units
Property,AccessCode,Access Code
Property,AccessibilityFeatures,Accessibility Features
Property,ActivationDate,Activation Date
Property,AdditionalParcelsDescription,Additional Parcels Description
Property,AdditionalParcelsYN,Additional Parcels Yes/No
Property,AnchorsCoTenants,Anchors & Cotenants
Property,Appliances,Appliances
Property,ArchitecturalStyle,Architectural Style
Property,AssociationAmenities,Association Amenities
Property,AssociationFee,Association Fee
Property,AssociationFee2,Association Fee 2
Property,AssociationFee2Frequency,Association Fee 2 Frequency
Property,AssociationFeeFrequency,Association Fee Frequency
Property,AssociationFeeIncludes,Association Fee Includes
Property,AssociationName,Association Name
Property,AssociationName2,Association Name 2
Property,AssociationPhone,Association Phone
Property,AssociationPhone2,Association Phone 2
Property,AssociationYN,Association Yes/No
Property,AttachedGarageYN,Attached Garage Yes/No
Property,AttributionContact,Attribution Contact
Property,AvailabilityDate,Availability Date
Property,AvailableLeaseType,Available Lease Type
Property,BackOnMarketDate,Back on Market Date
Property,Basement,Basement
Property,BasementYN,Basement Yes/No
Property,BathroomsFull,Bathrooms Full
Property,BathroomsHalf,Bathrooms Half
Property,BathroomsOneQuarter,Bathrooms One Quarter
Property,BathroomsPartial,Bathrooms Partial
Property,BathroomsThreeQuarter,Bathrooms Three Quarter
Property,BathroomsTotalInteger,Bathrooms Total Integer
Property,BedroomsPossible,Bedrooms Possible
Property,BedroomsTotal,Bedrooms Total
Property,BelowGradeFinishedArea,Below Grade Finished Area
Property,BelowGradeFinishedAreaSource,Below Grade Finished Area Source
Property,BelowGradeFinishedAreaUnits,Below Grade Finished Area Units
Property,BelowGradeUnfinishedArea,Below Grade Unfinished Area
Property,BelowGradeUnfinishedAreaSource,Below Grade Unfinished Area Source
Property,BelowGradeUnfinishedAreaUnits,Below Grade Unfinished Area Units
Property,BodyType,Body Type
Property,BuilderModel,Builder Model
Property,BuilderName,Builder Name
Property,BuildingAreaSource,Building Area Source
Property,BuildingAreaTotal,Building Area Total
Property,BuildingAreaUnits,Building Area Units
Property,BuildingFeatures,Building Features
Property,BuildingName,Building Name
Property,BusinessName,Business Name
Property,BusinessType,Business Type
Property,BuyerAgentAOR,Buyer Agent AOR
Property,BuyerAgentDesignation,Buyer Agent Designation
Property,BuyerAgentDirectPhone,Buyer Agent Direct Phone
Property,BuyerAgentEmail,Buyer Agent Email
Property,BuyerAgentFax,Buyer Agent Fax
Property,BuyerAgentFirstName,Buyer Agent First Name
Property,BuyerAgentFullName,Buyer Agent Full Name
Property,BuyerAgentHomePhone,Buyer Agent Home Phone
Property,BuyerAgentKey,Buyer Agent Key
Property,BuyerAgentLastName,Buyer Agent Last Name
Property,BuyerAgentMiddleName,Buyer Agent Middle Name
Property,BuyerAgentMlsId,Buyer Agent MLS ID
Property,BuyerAgentMobilePhone,Buyer Agent Mobile Phone
Property,BuyerAgentNamePrefix,Buyer Agent Name Prefix
Property,BuyerAgentNameSuffix,Buyer Agent Name Suffix
Property,BuyerAgentNationalAssociationId,Buyer Agent National Association ID
Property,BuyerAgentOfficePhone,Buyer Agent Office Phone
Property,BuyerAgentOfficePhoneExt,Buyer Agent Office Phone Ext
Property,BuyerAgentPager,Buyer Agent Pager
Property,BuyerAgentPreferredPhone,Buyer Agent Preferred Phone
Property,BuyerAgentPreferredPhoneExt,Buyer Agent Preferred Phone Ext
Property,BuyerAgentStateLicense,Buyer Agent State License
Property,BuyerAgentTollFreePhone,Buyer Agent Toll Free Phone
Property,BuyerAgentURL,Buyer Agent URL
Property,BuyerAgentVoiceMail,Buyer Agent Voice Mail
Property,BuyerAgentVoiceMailExt,Buyer Agent Voice Mail Ext
Property,BuyerBrokerageCompensation,Buyer Brokerage Compensation
Property,BuyerBrokerageCompensationType,Buyer Brokerage Compensation Type
Property,BuyerFinancing,Buyer Financing
Property,BuyerOfficeAOR,Buyer Office AOR
Property,BuyerOfficeEmail,Buyer Office Email
Property,BuyerOfficeFax,Buyer Office Fax
Property,BuyerOfficeKey,Buyer Office Key
Property,BuyerOfficeMlsId,Buyer Office MLS ID
Property,BuyerOfficeName,Buyer Office Name
Property,BuyerOfficeNationalAssociationId,Buyer Office National Association ID
Property,BuyerOfficePhone,Buyer Office Phone
Property,BuyerOfficePhoneExt,Buyer Office Phone Ext
Property,BuyerOfficeURL,Buyer Office URL
Property,BuyerTeamKey,Buyer Team Key
Property,BuyerTeamName,Buyer Team Name
Property,CableTvExpense,Cable TV Expense
Property,CancellationDate,Cancellation Date
Property,CapRate,Cap Rate
Property,CarportSpaces,Carport Spaces
Property,CarportYN,Carport Yes/No
Property,CarrierRoute,Carrier Route
Property,City,City
Property,CityRegion,City Region
Property,CloseDate,Close Date
Property,ClosePrice,Close Price
Property,CoBuyerAgentAOR,Co-Buyer Agent AOR
Property,CoBuyerAgentDesignation,Co-Buyer Agent Designation
Property,CoBuyerAgentDirectPhone,Co-Buyer Agent Direct Phone
Property,CoBuyerAgentEmail,Co-Buyer Agent Email
Property,CoBuyerAgentFax,Co-Buyer Agent Fax
Property,CoBuyerAgentFirstName,Co-Buyer Agent First Name
Property,CoBuyerAgentFullName,Co-Buyer Agent Full Name
Property,CoBuyerAgentHomePhone,Co-Buyer Agent Home Phone
Property,CoBuyerAgentKey,Co-Buyer Agent Key
Property,CoBuyerAgentLastName,Co-Buyer Agent Last Name
Property,CoBuyerAgentMiddleName,Co-Buyer Agent Middle Name
Property,CoBuyerAgentMlsId,Co-Buyer Agent MLS ID
Property,CoBuyerAgentMobilePhone,Co-Buyer Agent Mobile Phone
Property,CoBuyerAgentNamePrefix,Co-Buyer Agent Name Prefix
Property,CoBuyerAgentNameSuffix,Co-Buyer Agent Name Suffix
Property,CoBuyerAgentNationalAssociationId,Co-Buyer Agent National Association ID
Property,CoBuyerAgentOfficePhone,Co-Buyer Agent Office Phone
Property,CoBuyerAgentOfficePhoneExt,Co-Buyer Agent Office Phone Ext
Property,CoBuyerAgentPager,Co-Buyer Agent Pager
Property,CoBuyerAgentPreferredPhone,Co-Buyer Agent Preferred Phone
Property,CoBuyerAgentPreferredPhoneExt,Co-Buyer Agent Preferred Phone Ext
Property,CoBuyerAgentStateLicense,Co-Buyer Agent State License
Property,CoBuyerAgentTollFreePhone,Co-Buyer Agent Toll Free Phone
Property,CoBuyerAgentURL,Co-Buyer Agent URL
Property,CoBuyerAgentVoiceMail,Co-Buyer Agent Voice Mail
Property,CoBuyerAgentVoiceMailExt,Co-Buyer Agent Voice Mail Ext
Property,CoBuyerOfficeAOR,Co-Buyer Office AOR
Property,CoBuyerOfficeEmail,Co-Buyer Office Email
Property,CoBuyerOfficeFax,Co-Buyer Office Fax
Property,CoBuyerOfficeKey,Co-Buyer Office Key
Property,CoBuyerOfficeMlsId,Co-Buyer Office MLS ID
Property,CoBuyerOfficeName,Co-Buyer Office Name
Property,CoBuyerOfficeNationalAssociationId,Co-Buyer Office National Association ID
Property,CoBuyerOfficePhone,Co-Buyer Office Phone
Property,CoBuyerOfficePhoneExt,Co-Buyer Office Phone Ext
Property,CoBuyerOfficeURL,Co-Buyer Office URL
Property,CoListAgentAOR,Co-List Agent AOR
Property,CoListAgentDesignation,Co-List Agent Designation
Property,CoListAgentDirectPhone,Co-List Agent Direct Phone
Property,CoListAgentEmail,Co-List Agent Email
Property,CoListAgentFax,Co-List Agent Fax
Property,CoListAgentFirstName,Co-List Agent First Name
Property,CoListAgentFullName,Co-List Agent Full Name
Property,CoListAgentHomePhone,Co-List Agent Home Phone
Property,CoListAgentKey,Co-List Agent Key
Property,CoListAgentLastName,Co-List Agent Last Name
Property,CoListAgentMiddleName,Co-List Agent Middle Name
Property,CoListAgentMlsId,Co-List Agent MLS ID
Property,CoListAgentMobilePhone,Co-List Agent Mobile Phone
Property,CoListAgentNamePrefix,Co-List Agent Name Prefix
Property,CoListAgentNameSuffix,Co-List Agent Name Suffix
Property,CoListAgentNationalAssociationId,Co-List Agent National Association ID
Property,CoListAgentOfficePhone,Co-List Agent Office Phone
Property,CoListAgentOfficePhoneExt,Co-List Agent Office Phone Ext
Property,CoListAgentPager,Co-List Agent Pager
Property,CoListAgentPreferredPhone,Co-List Agent Preferred Phone
Property,CoListAgentPreferredPhoneExt,Co-List Agent Preferred Phone Ext
Property,CoListAgentStateLicense,Co-List Agent State License
Property,CoListAgentTollFreePhone,Co-List Agent Toll Free Phone
Property,CoListAgentURL,Co-List Agent URL
Property,CoListAgentVoiceMail,Co-List Agent Voice Mail
Property,CoListAgentVoiceMailExt,Co-List Agent Voice Mail Ext
Property,CoListOfficeAOR,Co-List Office AOR
Property,CoListOfficeEmail,Co-List Office Email
Property,CoListOfficeFax,Co-List Office Fax
Property,CoListOfficeKey,Co-List Office Key
Property,CoListOfficeMlsId,Co-List Office MLS ID
Property,CoListOfficeName,Co-List Office Name
Property,CoListOfficeNationalAssociationId,Co-List Office National Association ID
Property,CoListOfficePhone,Co-List Office Phone
Property,CoListOfficePhoneExt,Co-List Office Phone Ext
Property,CoListOfficeURL,Co-List Office URL
Property,CommonInterest,Common Interest
Property,CommonWalls,Common Walls
Property,CommunityFeatures,Community Features
Property,CompensationComments,Compensation Comments
Property,CompSaleYN,Comp Sale Yes/No
Property,Concessions,Concessions
Property,ConcessionsAmount,Concessions Amount
Property,ConcessionsComments,Concessions Comments
Property,ConstructionMaterials,Construction Materials
Property,ContinentRegion,Continent Region
Property,Contingency,Contingency
Property,ContingentDate,Contingent Date
Property,ContractStatusChangeDate,Contract Status Change Date
Property,Cooling,Cooling
Property,CoolingYN,Cooling Yes/No
Property,CopyrightNotice,Copyright Notice
Property,Country,Country
Property,CountryRegion,Country Region
Property,CountyOrParish,County Or Parish
Property,CoveredSpaces,Covered Spaces
Property,CropsIncludedYN,Crops Included Yes/No
Property,CrossStreet,Cross Street
Property,CultivatedArea,Cultivated Area
Property,CumulativeDaysOnMarket,Cumulative Days On Market
Property,CurrentFinancing,Current Financing
Property,CurrentUse,Current Use
Property,DaysInMls,Days in MLS
Property,DaysOnMarket,Days On Market
Property,DaysOnSite,Days on Site
Property,DevelopmentStatus,Development Status
Property,DirectionFaces,Direction Faces
Property,Directions,Directions
Property,Disclaimer,Disclaimer
Property,Disclosures,Disclosures
Property,DistanceToBusComments,Distance To Bus Comments
Property,DistanceToBusNumeric,Distance To Bus Numeric
Property,DistanceToBusUnits,Distance To Bus Units
Property,DistanceToElectricComments,Distance To Electric Comments
Property,DistanceToElectricNumeric,Distance To Electric Numeric
Property,DistanceToElectricUnits,Distance To Electric Units
Property,DistanceToFreewayComments,Distance To Freeway Comments
Property,DistanceToFreewayNumeric,Distance To Freeway Numeric
Property,DistanceToFreewayUnits,Distance To Freeway Units
Property,DistanceToGasComments,Distance To Gas Comments
Property,DistanceToGasNumeric,Distance To Gas Numeric
Property,DistanceToGasUnits,Distance To Gas Units
Property,DistanceToPhoneServiceComments,Distance To Phone Service Comments
Property,DistanceToPhoneServiceNumeric,Distance To Phone Service Numeric
Property,DistanceToPhoneServiceUnits,Distance To Phone Service Units
Property,DistanceToPlaceofWorshipComments,Distance To Placeof Worship Comments
Property,DistanceToPlaceofWorshipNumeric,Distance To Placeof Worship Numeric
Property,DistanceToPlaceofWorshipUnits,Distance To Placeof Worship Units
Property,DistanceToSchoolBusComments,Distance To School Bus Comments
Property,DistanceToSchoolBusNumeric,Distance To School Bus Numeric
Property,DistanceToSchoolBusUnits,Distance To School Bus Units
Property,DistanceToSchoolsComments,Distance To Schools Comments
Property,DistanceToSchoolsNumeric,Distance To Schools Numeric
Property,DistanceToSchoolsUnits,Distance To Schools Units
Property,DistanceToSewerComments,Distance To Sewer Comments
Property,DistanceToSewerNumeric,Distance To Sewer Numeric
Property,DistanceToSewerUnits,Distance To Sewer Units
Property,DistanceToShoppingComments,Distance To Shopping Comments
Property,DistanceToShoppingNumeric,Distance To Shopping Numeric
Property,DistanceToShoppingUnits,Distance To Shopping Units
Property,DistanceToStreetComments,Distance To Street Comments
Property,DistanceToStreetNumeric,Distance To Street Numeric
Property,DistanceToStreetUnits,Distance To Street Units
Property,DistanceToWaterComments,Distance To Water Comments
Property,DistanceToWaterNumeric,Distance To Water Numeric
Property,DistanceToWaterUnits,Distance To Water Units
Property,DocumentsAvailable,Documents Available
Property,DocumentsChangeTimestamp,Documents Change Timestamp
Property,DocumentsCount,Documents Count
Property,DocumentStatus,Document Status
Property,DOH1,DOH 1
Property,DOH2,DOH 2
Property,DOH3,DOH 3
Property,DoorFeatures,Door Features
Property,DualOrVariableRateCommissionYN,Dual or Variable Rate Commission Yes/No
Property,Electric,Electric
Property,ElectricExpense,Electric Expense
Property,ElectricOnPropertyYN,Electric On Property Yes/No
Property,ElementarySchool,Elementary School
Property,ElementarySchoolDistrict,Elementary School District
Property,Elevation,Elevation
Property,ElevationUnits,Elevation Units
Property,EntryLevel,Entry Level
Property,EntryLocation,Entry Location
Property,Exclusions,Exclusions
Property,ExistingLeaseType,Existing Lease Type
Property,ExpirationDate,Expiration Date
Property,ExteriorFeatures,Exterior Features
Property,FarmCreditServiceInclYN,Farm Credit Service Incl Yes/No
Property,FarmLandAreaSource,Farm Land Area Source
Property,FarmLandAreaUnits,Farm Land Area Units
Property,Fencing,Fencing
Property,FhaEligibility,FHA Eligibility
Property,FinancialDataSource,Financial Data Source
Property,FireplaceFeatures,Fireplace Features
Property,FireplacesTotal,Fireplaces Total
Property,FireplaceYN,Fireplace Yes/No
Property,Flooring,Flooring
Property,FoundationArea,Foundation Area
Property,FoundationDetails,Foundation Details
Property,FrontageLength,Frontage Length
Property,FrontageType,Frontage Type
Property,FuelExpense,Fuel Expense
Property,Furnished,Furnished
Property,FurnitureReplacementExpense,Furniture Replacement Expense
Property,GarageSpaces,Garage Spaces
Property,GarageYN,Garage Yes/No
Property,GardenerExpense,Gardener Expense
Property,GrazingPermitsBlmYN,Grazing Permits BLM Yes/No
Property,GrazingPermitsForestServiceYN,Grazing Permits Forest Service Yes/No
Property,GrazingPermitsPrivateYN,Grazing Permits Private Yes/No
Property,GreenBuildingVerification,Green Building Verification
Property,GreenBuildingVerificationType,Green Building Verification Type
Property,GreenEnergyEfficient,Green Energy Efficient
Property,GreenEnergyGeneration,Green Energy Generation
Property,GreenIndoorAirQuality,Green Indoor Air Quality
Property,GreenLocation,Green Location
Property,GreenSustainability,Green Sustainability
Property,GreenVerificationYN,Green Verification Yes/No
Property,GreenWaterConservation,Green Water Conservation
Property,GrossIncome,Gross Income
Property,GrossLivingAreaAnsi,Gross Living Area ANSI
Property,GrossScheduledIncome,Gross Scheduled Income
Property,HabitableResidenceYN,Habitable Residence Yes/No
Property,Heating,Heating
Property,HeatingYN,Heating Yes/No
Property,HighSchool,High School
Property,HighSchoolDistrict,High School District
Property,HistoryTransactional,History Transactional
Property,HomeWarrantyYN,Home Warranty Yes/No
Property,HorseAmenities,Horse Amenities
Property,HorseYN,Horse Yes/No
Property,HoursDaysOfOperation,Hours/Days Of Operation
Property,HoursDaysOfOperationDescription,Hours/Days Of Operation Description
Property,Inclusions,Inclusions
Property,IncomeIncludes,Income Includes
Property,InsuranceExpense,Insurance Expense
Property,InteriorFeatures,Interior Features
Property,InternetAddressDisplayYN,Internet Address Display Yes/No
Property,InternetAutomatedValuationDisplayYN,Internet Automated Valuation Display Yes/No
Property,InternetConsumerCommentYN,Internet Consumer Comment Yes/No
Property,InternetEntireListingDisplayYN,Internet Entire Listing Display Yes/No
Property,IrrigationSource,Irrigation Source
Property,IrrigationWaterRightsAcres,Irrigation Water Rights Acres
Property,IrrigationWaterRightsYN,Irrigation Water Rights Yes/No
Property,LaborInformation,Labor Information
Property,LandLeaseAmount,Land Lease Amount
Property,LandLeaseAmountFrequency,Land Lease Amount Frequency
Property,LandLeaseExpirationDate,Land Lease Expiration Date
Property,LandLeaseYN,Land Lease Yes/No
Property,Latitude,Latitude
Property,LaundryFeatures,Laundry Features
Property,LeasableArea,Leasable Area
Property,LeasableAreaUnits,Leasable Area Units
Property,LeaseAmount,Lease Amount
Property,LeaseAmountFrequency,Lease Amount Frequency
Property,LeaseAssignableYN,Lease Assignable Yes/No
Property,LeaseConsideredYN,Lease Considered Yes/No
Property,LeaseExpiration,Lease Expiration
Property,LeaseRenewalCompensation,Lease Renewal Compensation
Property,LeaseRenewalOptionYN,Lease Renewal Option Yes/No
Property,LeaseTerm,Lease Term
Property,Levels,Levels
Property,License1,License 1
Property,License2,License 2
Property,License3,License 3
Property,LicensesExpense,Licenses Expense
Property,ListAgent,List Agent
Property,ListAgentAOR,List Agent AOR
Property,ListAgentDesignation,List Agent Designation
Property,ListAgentDirectPhone,List Agent Direct Phone
Property,ListAgentEmail,List Agent Email
Property,ListAgentFax,List Agent Fax
Property,ListAgentFirstName,List Agent First Name
Property,ListAgentFullName,List Agent Full Name
Property,ListAgentHomePhone,List Agent Home Phone
Property,ListAgentKey,List Agent Key
Property,ListAgentLastName,List Agent Last Name
Property,ListAgentMiddleName,List Agent Middle Name
Property,ListAgentMlsId,List Agent MLS ID
Property,ListAgentMobilePhone,List Agent Mobile Phone
Property,ListAgentNamePrefix,List Agent Name Prefix
Property,ListAgentNameSuffix,List Agent Name Suffix
Property,ListAgentNationalAssociationId,List Agent National Association ID
Property,ListAgentOfficePhone,List Agent Office Phone
Property,ListAgentOfficePhoneExt,List Agent Office Phone Ext
Property,ListAgentPager,List Agent Pager
Property,ListAgentPreferredPhone,List Agent Preferred Phone
Property,ListAgentPreferredPhoneExt,List Agent Preferred Phone Ext
Property,ListAgentStateLicense,List Agent State License
Property,ListAgentTollFreePhone,List Agent Toll Free Phone
Property,ListAgentURL,List Agent URL
Property,ListAgentVoiceMail,List Agent Voice Mail
Property,ListAgentVoiceMailExt,List Agent Voice Mail Ext
Property,ListAOR,List AOR
Property,ListingAgreement,Listing Agreement
Property,ListingContractDate,Listing Contract Date
Property,ListingId,Listing ID
Property,ListingKey,Listing Key
Property,ListingService,Listing Service
Property,ListingTerms,Listing Terms
Property,ListingURL,Listing URL
Property,ListingURLDescription,Listing URL Description
Property,ListOffice,List Office
Property,ListOfficeAOR,List Office AOR
Property,ListOfficeEmail,List Office Email
Property,ListOfficeFax,List Office Fax
Property,ListOfficeKey,List Office Key
Property,ListOfficeMlsId,List Office MLS ID
Property,ListOfficeName,List Office Name
Property,ListOfficeNationalAssociationId,List Office National Association ID
Property,ListOfficePhone,List Office Phone
Property,ListOfficePhoneExt,List Office Phone Ext
Property,ListOfficeURL,List Office URL
Property,ListPrice,List Price
Property,ListPriceLow,List Price Low
Property,ListTeam,List Team
Property,ListTeamKey,List Team Key
Property,ListTeamName,List Team Name
Property,LivingArea,Living Area
Property,LivingAreaSource,Living Area Source
Property,LivingAreaUnits,Living Area Units
Property,LockBoxLocation,Lock Box Location
Property,LockBoxSerialNumber,Lock Box Serial Number
Property,LockBoxType,Lock Box Type
Property,Longitude,Longitude
Property,LotDimensionsSource,Lot Dimensions Source
Property,LotFeatures,Lot Features
Property,LotSizeAcres,Lot Size Acres
Property,LotSizeArea,Lot Size Area
Property,LotSizeDimensions,Lot Size Dimensions
Property,LotSizeSource,Lot Size Source
Property,LotSizeSquareFeet,Lot Size Square Feet
Property,LotSizeUnits,Lot Size Units
Property,MainLevelBathrooms,Main Level Bathrooms
Property,MainLevelBedrooms,Main Level Bedrooms
Property,MaintenanceExpense,Maintenance Expense
Property,MajorChangeTimestamp,Major Change Timestamp
Property,MajorChangeType,Major Change Type
Property,Make,Make
Property,ManagerExpense,Manager Expense
Property,MapCoordinate,Map Coordinate
Property,MapCoordinateSource,Map Coordinate Source
Property,MapURL,Map URL
Property,Media,Media
Property,MiddleOrJuniorSchool,Middle Or Junior School
Property,MiddleOrJuniorSchoolDistrict,Middle Or Junior School District
Property,MLSAreaMajor,MLS Area Major
Property,MLSAreaMinor,MLS Area Minor
Property,MlsStatus,MLS Status
Property,MobileDimUnits,Mobile Dimensions Units
Property,MobileHomeRemainsYN,Mobile Home Remains Yes/No
Property,MobileLength,Mobile Length
Property,MobileWidth,Mobile Width
Property,Model,Model
Property,ModificationTimestamp,Modification Timestamp
Property,NetOperatingIncome,Net Operating Income
Property,NewConstructionYN,New Construction Yes/No
Property,NewTaxesExpense,New Taxes Expense
Property,NumberOfBuildings,Number Of Buildings
Property,NumberOfFullTimeEmployees,Number Of Full Time Employees
Property,NumberOfLots,Number Of Lots
Property,NumberOfPads,Number Of Pads
Property,NumberOfPartTimeEmployees,Number Of Part Time Employees
Property,NumberOfSeparateElectricMeters,Number Of Separate Electric Meters
Property,NumberOfSeparateGasMeters,Number Of Separate Gas Meters
Property,NumberOfSeparateWaterMeters,Number Of Separate Water Meters
Property,NumberOfUnitsInCommunity,Number Of Units In Community
Property,NumberOfUnitsLeased,Number Of Units Leased
Property,NumberOfUnitsMoMo,Number Of Units Month To Month
Property,NumberOfUnitsTotal,Number Of Units Total
Property,NumberOfUnitsVacant,Number Of Units Vacant
Property,OccupantName,Occupant Name
Property,OccupantPhone,Occupant Phone
Property,OccupantType,Occupant Type
Property,OffMarketDate,Off Market Date
Property,OffMarketTimestamp,Off Market Timestamp
Property,OnMarketDate,On Market Date
Property,OnMarketTimestamp,On Market Timestamp
Property,OpenHouse,Open House
Property,OpenHouseModificationTimestamp,Open House Modification Timestamp
Property,OpenParkingSpaces,Open Parking Spaces
Property,OpenParkingYN,Open Parking Yes/No
Property,OperatingExpense,Operating Expense
Property,OperatingExpenseIncludes,Operating Expense Includes
Property,OriginalEntryTimestamp,Original Entry Timestamp
Property,OriginalListPrice,Original List Price
Property,OriginatingSystem,Originating System
Property,OriginatingSystemID,Originating System ID
Property,OriginatingSystemKey,Originating System Key
Property,OriginatingSystemName,Originating System Name
Property,OtherEquipment,Other Equipment
Property,OtherExpense,Other Expense
Property,OtherParking,Other Parking
Property,OtherStructures,Other Structures
Property,OwnerName,Owner Name
Property,OwnerPays,Owner Pays
Property,OwnerPhone,Owner Phone
Property,Ownership,Ownership
Property,OwnershipType,Ownership Type
Property,ParcelNumber,Parcel Number
Property,ParkManagerName,Park Manager Name
Property,ParkManagerPhone,Park Manager Phone
Property,ParkName,Park Name
Property,ParkingFeatures,Parking Features
Property,ParkingTotal,Parking Total
Property,PastureArea,Pasture Area
Property,PatioAndPorchFeatures,Patio And Porch Features
Property,PendingTimestamp,Pending Timestamp
Property,PestControlExpense,Pest Control Expense
Property,PetsAllowed,Pets Allowed
Property,PhotosChangeTimestamp,Photos Change Timestamp
Property,PhotosCount,Photos Count
Property,PoolExpense,Pool Expense
Property,PoolFeatures,Pool Features
Property,PoolPrivateYN,Pool Private Yes/No
Property,Possession,Possession
Property,PossibleUse,Possible Use
Property,PostalCity,Postal City
Property,PostalCode,Postal Code
Property,PostalCodePlus4,Postal Code Plus4
Property,PowerProduction,Power Production
Property,PowerProductionType,Power Production Type
Property,PowerProductionYN,Power Production Yes/No
Property,PreviousListPrice,Previous List Price
Property,PriceChangeTimestamp,Price Change Timestamp
Property,PrivateOfficeRemarks,Private Office Remarks
Property,PrivateRemarks,Private Remarks
Property,ProfessionalManagementExpense,Professional Management Expense
Property,PropertyAttachedYN,Property Attached Yes/No
Property,PropertyCondition,Property Condition
Property,PropertySubType,Property Sub Type
Property,PropertyTimeZoneName,Property Time Zone Name
Property,PropertyTimeZoneObservesDstYN,Property Time Zone Observes DST Yes/No
Property,PropertyTimeZoneStandardOffset,Property Time Zone Standard Offset
Property,PropertyType,Property Type
Property,PublicRemarks,Public Remarks
Property,PublicSurveyRange,Public Survey Range
Property,PublicSurveySection,Public Survey Section
Property,PublicSurveyTownship,Public Survey Township
Property,PurchaseContractDate,Purchase Contract Date
Property,RangeArea,Range Area
Property,RentControlYN,Rent Control Yes/No
Property,RentIncludes,Rent Includes
Property,RoadFrontageType,Road Frontage Type
Property,RoadResponsibility,Road Responsibility
Property,RoadSurfaceType,Road Surface Type
Property,Roof,Roof
Property,Rooms,Rooms
Property,RoomsTotal,Rooms Total
Property,RoomType,Room Type
Property,RVParkingDimensions,RV Parking Dimensions
Property,SeatingCapacity,Seating Capacity
Property,SecurityFeatures,Security Features
Property,SeniorCommunityYN,Senior Community Yes/No
Property,SerialU,Serial U
Property,SerialX,Serial X
Property,SerialXX,Serial XX
Property,Sewer,Sewer
Property,ShowingAdvanceNotice,Showing Advance Notice
Property,ShowingAttendedYN,Showing Attended Yes/No
Property,ShowingConsiderations,Showing Considerations
Property,ShowingContactName,Showing Contact Name
Property,ShowingContactPhone,Showing Contact Phone
Property,ShowingContactPhoneExt,Showing Contact Phone Ext
Property,ShowingContactType,Showing Contact Type
Property,ShowingDays,Showing Days
Property,ShowingEndTime,Showing End Time
Property,ShowingInstructions,Showing Instructions
Property,ShowingRequirements,Showing Requirements
Property,ShowingServiceName,Showing Service Name
Property,ShowingStartTime,Showing Start Time
Property,SignOnPropertyYN,Sign On Property Yes/No
Property,SimpleDaysOnMarket,Simple Days on Market
Property,Skirt,Skirt
Property,SocialMedia,Social Media
Property,SourceSystem,Source System
Property,SourceSystemID,Source System ID
Property,SourceSystemKey,Source System Key
Property,SourceSystemName,Source System Name
Property,SpaFeatures,Spa Features
Property,SpaYN,Spa Yes/No
Property,SpecialLicenses,Special Licenses
Property,SpecialListingConditions,Special Listing Conditions
Property,StandardStatus,Standard Status
Property,StartShowingDate,Start Showing Date
Property,StateOrProvince,State Or Province
Property,StateRegion,State Region
Property,StatusChangeTimestamp,Status Change Timestamp
Property,Stories,Stories
Property,StoriesTotal,Stories Total
Property,StreetAdditionalInfo,Street Additional Info
Property,StreetDirPrefix,Street Direction Prefix
Property,StreetDirSuffix,Street Direction Suffix
Property,StreetName,Street Name
Property,StreetNumber,Street Number
Property,StreetNumberNumeric,Street Number Numeric
Property,StreetSuffix,Street Suffix
Property,StreetSuffixModifier,Street Suffix Modifier
Property,StructureType,Structure Type
Property,SubAgencyCompensation,Sub Agency Compensation
Property,SubAgencyCompensationType,Sub Agency Compensation Type
Property,SubdivisionName,Subdivision Name
Property,SuppliesExpense,Supplies Expense
Property,SyndicateTo,Syndicate To
Property,SyndicationRemarks,Syndication Remarks
Property,TaxAnnualAmount,Tax Annual Amount
Property,TaxAnnualAmountPerLivingAreaUnit,Tax Annual Amount Per Living Area Unit
Property,TaxAnnualAmountPerSquareFoot,Tax Annual Amount Per Square Foot
Property,TaxAssessedValue,Tax Assessed Value
Property,TaxBlock,Tax Block
Property,TaxBookNumber,Tax Book Number
Property,TaxLegalDescription,Tax Legal Description
Property,TaxLot,Tax Lot
Property,TaxMapNumber,Tax Map Number
Property,TaxOtherAnnualAssessmentAmount,Tax Other Annual Assessment Amount
Property,TaxParcelLetter,Tax Parcel Letter
Property,TaxStatusCurrent,Tax Status Current
Property,TaxTract,Tax Tract
Property,TaxYear,Tax Year
Property,TenantPays,Tenant Pays
Property,Topography,Topography
Property,TotalActualRent,Total Actual Rent
Property,Township,Township
Property,TransactionBrokerCompensation,Transaction Broker Compensation
Property,TransactionBrokerCompensationType,Transaction Broker Compensation Type
Property,TrashExpense,Trash Expense
Property,UnitNumber,Unit Number
Property,UnitsFurnished,Units Furnished
Property,UnitTypes,Unit Types
Property,UnitTypeType,Unit Type Type
Property,UniversalPropertyId,Universal Property ID
Property,UniversalPropertySubId,Universal Property Sub ID
Property,UnparsedAddress,Unparsed Address
Property,Utilities,Utilities
Property,VacancyAllowance,Vacancy Allowance
Property,VacancyAllowanceRate,Vacancy Allowance Rate
Property,Vegetation,Vegetation
Property,VideosChangeTimestamp,Videos Change Timestamp
Property,VideosCount,Videos Count
Property,View,View
Property,ViewYN,View Yes/No
Property,VirtualTourURLBranded,Virtual Tour URL Branded
Property,VirtualTourURLUnbranded,Virtual Tour URL Unbranded
Property,WalkScore,Walk Score
Property,WaterBodyName,Water Body Name
Property,WaterfrontFeatures,Waterfront Features
Property,WaterfrontYN,Waterfront Yes/No
Property,WaterSewerExpense,Water Sewer Expense
Property,WaterSource,Water Source
Property,WindowFeatures,Window Features
Property,WithdrawnDate,Withdrawn Date
Property,WoodedArea,Wooded Area
Property,WorkmansCompensationExpense,Workmans Compensation Expense
Property,YearBuilt,Year Built
Property,YearBuiltDetails,Year Built Details
Property,YearBuiltEffective,Year Built Effective
Property,YearBuiltSource,Year Built Source
Property,YearEstablished,Year Established
Property,YearsCurrentOwner,Years Current Owner
Property,Zoning,Zoning
Property,ZoningDescription,Zoning Description
Association,AssociationAddress1,Association Address 1
Association,AssociationAddress2,Association Address 2
Association,AssociationCareOf,Association Care Of
Association,AssociationCharterDate,Association Charter Date
Association,AssociationCity,Association City
Association,AssociationCountry,Association Country
Association,AssociationCountyOrParish,Association County or Parish
Association,AssociationFax,Association Fax
Association,AssociationKey,Association Key
Association,AssociationMailAddress1,Association Mail Address 1
Association,AssociationMailAddress2,Association Mail Address 2
Association,AssociationMailCareOf,Association Mail Care Of
Association,AssociationMailCity,Association Mail City
Association,AssociationMailCountry,Association Mail Country
Association,AssociationMailCountyOrParish,Association Mail County or Parish
Association,AssociationMailPostalCode,Association Mail Postal Code
Association,AssociationMailPostalCodePlus4,Association Mail Postal Code Plus 4
Association,AssociationMailStateOfProvince,Association Mail State or Province
Association,AssociationMember,Association Member
Association,AssociationMlsId,Association MLS ID
Association,AssociationName,Association Name
Association,AssociationNationalAssociationId,Association National Association ID
Association,AssociationPhone,Association Phone
Association,AssociationPostalCode,Association Postal Code
Association,AssociationPostalCodePlus4,Association Postal Code Plus 4
Association,AssociationSocialMedia,Association Social Media
Association,AssociationStateOrProvince,Association State or Province
Association,AssociationStatus,Association Status
Association,AssociationType,Association Type
Association,ExecutiveOfficerMemberKey,Executive Officer Member Key
Association,ExecutiveOfficerMemberMlsId,Executive Officer Member MLS ID
Association,HistoryTransactional,History Transactional
Association,ModificationTimestamp,Modification Timestamp
Association,MultipleListingServiceId,Multiple Listing Service ID
Association,OriginalEntryTimestamp,Original Entry Timestamp
Association,OriginatingSystem,Originating System
Association,OriginatingSystemAssociationKey,Originating System Association Key
Association,OriginatingSystemId,Originating System ID
Association,OriginatingSystemName,Originating System Name
Association,SocialMediaType,Social Media Type
Association,SocialMediaUrlOrId,Social Media Type URL or ID
Association,SourceSystem,Source System
Association,SourceSystemAssociationKey,Source System Association Key
Association,SourceSystemId,Source System ID
Association,SourceSystemName,Source System Name
Caravan,CancellationPolicyUrl,Cancellation Policy URL
Caravan,CaravanAllowedClassNames,Caravan Allowed Class Names
Caravan,CaravanAllowedStatuses,Caravan Allowed Statuses
Caravan,CaravanAreaDescription,Caravan Area Description
Caravan,CaravanBlackoutDates,Caravan Blackout Dates
Caravan,CaravanDate,Caravan Date
Caravan,CaravanDaysRecurring,Caravan Days Recurring
Caravan,CaravanEndTime,Caravan End Time
Caravan,CaravanInputDeadlineDescription,Caravan Input Deadline Description
Caravan,CaravanInputDeadlineTimestamp,Caravan Input Deadline Timestamp
Caravan,CaravanKey,Caravan Key
Caravan,CaravanName,Caravan Name
Caravan,CaravanOrganizerContactInfo,Caravan Organizer Contact Info
Caravan,CaravanOrganizerKey,Caravan Organizer Key
Caravan,CaravanOrganizerMlsId,Caravan Organizer MLS ID
Caravan,CaravanOrganizerName,Caravan Organizer Name
Caravan,CaravanOrganizerResourceName,Caravan Organizer Resource Name
Caravan,CaravanPolicyUrl,Caravan Policy URL
Caravan,CaravanRemarks,Caravan Remarks
Caravan,CaravanStartLocation,Caravan Start Location
Caravan,CaravanStartLocationGiveaways,Caravan Start Location Giveaways
Caravan,CaravanStartLocationRefreshments,Caravan Start Location Refreshments
Caravan,CaravanStartTime,Caravan Start Time
Caravan,CaravanStatus,Caravan Status
Caravan,CaravanType,Caravan Type
Caravan,ModificationTimestamp,Modification Timestamp
Caravan,OriginalEntryTimestamp,Original Entry Timestamp
Caravan,OriginatingSystemId,Originating System ID
Caravan,OriginatingSystemKey,Originating System Key
Caravan,OriginatingSystemName,Originating System Name
Caravan,SourceSystemId,Source System ID
Caravan,SourceSystemKey,Source System Key
Caravan,SourceSystemName,Source System Name
CaravanStop,CaravanKey,Caravan Key
CaravanStop,CaravanStopKey,Caravan Stop Key
CaravanStop,ModificationTimestamp,Modification Timestamp
CaravanStop,OriginalEntryTimestamp,Original Entry Timestamp
CaravanStop,OriginatingSystemId,Originating System ID
CaravanStop,OriginatingSystemKey,Originating System Key
CaravanStop,OriginatingSystemName,Originating System Name
CaravanStop,SourceSystemId,Source System ID
CaravanStop,SourceSystemKey,Source System Key
CaravanStop,SourceSystemName,Source System Name
CaravanStop,StopAttendedBy,Stop Attended By
CaravanStop,StopClassName,Stop Class Name
CaravanStop,StopDate,Stop Date
CaravanStop,StopEndTime,Stop End Time
CaravanStop,StopId,Stop ID
CaravanStop,StopKey,Stop Key
CaravanStop,StopOrder,Stop Order
CaravanStop,StopRefreshments,Stop Refreshments
CaravanStop,StopRemarks,Stop Remarks
CaravanStop,StopResourceName,Stop Resource Name
CaravanStop,StopShowingAgentFirstName,Stop Showing Agent First Name
CaravanStop,StopShowingAgentKey,Stop Showing Agent Key
CaravanStop,StopShowingAgentLastName,Stop Showing Agent Last Name
CaravanStop,StopShowingAgentMlsId,Stop Showing Agent MLS ID
CaravanStop,StopStartTime,Stop Start Time
ContactListingNotes,Contact,Contact
ContactListingNotes,ContactKey,Contact Key
ContactListingNotes,ContactListingNotesKey,Contact Listing Notes Key
ContactListingNotes,HistoryTransactional,History Transactional
ContactListingNotes,Listing,Listing
ContactListingNotes,ListingId,Listing ID
ContactListingNotes,ListingKey,Listing Key
ContactListingNotes,ModificationTimestamp,Modification Timestamp
ContactListingNotes,NoteContents,Note Contents
ContactListingNotes,NotedBy,Noted By
ContactListings,AgentNotesUnreadYN,Agent Notes Unread Yes/No
ContactListings,ClassName,Class Name
ContactListings,Contact,Contact
ContactListings,ContactKey,Contact Key
ContactListings,ContactListingPreference,Contact Listing Preference
ContactListings,ContactListingsKey,Contact Listings Key
ContactListings,ContactLoginId,Contact Login ID
ContactListings,ContactNotesUnreadYN,Contact Notes Unread Yes/No
ContactListings,DirectEmailYN,Direct Email Yes/No
ContactListings,HistoryTransactional,History Transactional
ContactListings,LastAgentNoteTimestamp,Last Agent Note Timestamp
ContactListings,LastContactNoteTimestamp,Last Contact Note Timestamp
ContactListings,Listing,Listing
ContactListings,ListingId,Listing ID
ContactListings,ListingKey,Listing Key
ContactListings,ListingModificationTimestamp,Listing Modification Timestamp
ContactListings,ListingNotes,Listing Notes
ContactListings,ListingSentTimestamp,Listing Sent Timestamp
ContactListings,ListingViewedYN,Listing Viewed Yes/No
ContactListings,ModificationTimestamp,Modification Timestamp
ContactListings,PortalLastVisitedTimestamp,Portal Last Visited Timestamp
ContactListings,ResourceName,Resource Name
Contacts,Anniversary,Anniversary
Contacts,AssistantEmail,Assistant Email
Contacts,AssistantName,Assistant Name
Contacts,AssistantPhone,Assistant Phone
Contacts,AssistantPhoneExt,Assistant Phone Ext
Contacts,Birthdate,Birthdate
Contacts,BusinessFax,Business Fax
Contacts,Children,Children
Contacts,Company,Company
Contacts,ContactKey,Contact Key
Contacts,ContactLoginId,Contact Login ID
Contacts,ContactPassword,Contact Password
Contacts,ContactsOtherPhone,Contacts Other Phone
Contacts,ContactsSocialMedia,Contacts Social Media
Contacts,ContactStatus,Contact Status
Contacts,ContactType,Contact Type
Contacts,Department,Department
Contacts,DirectPhone,Direct Phone
Contacts,Email,Email
Contacts,Email2,Email 2
Contacts,Email3,Email 3
Contacts,FirstName,First Name
Contacts,FullName,Full Name
Contacts,HistoryTransactional,History Transactional
Contacts,HomeAddress1,Home Address 1
Contacts,HomeAddress2,Home Address 2
Contacts,HomeCarrierRoute,Home Carrier Route
Contacts,HomeCity,Home City
Contacts,HomeCountry,Home Country
Contacts,HomeCountyOrParish,Home County Or Parish
Contacts,HomeFax,Home Fax
Contacts,HomePhone,Home Phone
Contacts,HomePostalCode,Home Postal Code
Contacts,HomePostalCodePlus4,Home Postal Code Plus 4
Contacts,HomeStateOrProvince,Home State Or Province
Contacts,JobTitle,Job Title
Contacts,Language,Language
Contacts,LastName,Last Name
Contacts,LeadSource,Lead Source
Contacts,Media,Media
Contacts,MiddleName,Middle Name
Contacts,MobilePhone,Mobile Phone
Contacts,ModificationTimestamp,Modification Timestamp
Contacts,NamePrefix,Name Prefix
Contacts,NameSuffix,Name Suffix
Contacts,Nickname,Nickname
Contacts,Notes,Notes
Contacts,OfficePhone,Office Phone
Contacts,OfficePhoneExt,Office Phone Ext
Contacts,OriginalEntryTimestamp,Original Entry Timestamp
Contacts,OriginatingSystem,Originating System
Contacts,OriginatingSystemContactKey,Originating System Contact Key
Contacts,OriginatingSystemID,Originating System ID
Contacts,OriginatingSystemName,Originating System Name
Contacts,OtherAddress1,Other Address 1
Contacts,OtherAddress2,Other Address 2
Contacts,OtherCarrierRoute,Other Carrier Route
Contacts,OtherCity,Other City
Contacts,OtherCountry,Other Country
Contacts,OtherCountyOrParish,Other County Or Parish
Contacts,OtherPhoneType,Other Phone Type
Contacts,OtherPostalCode,Other Postal Code
Contacts,OtherPostalCodePlus4,Other Postal Code Plus 4
Contacts,OtherStateOrProvince,Other State Or Province
Contacts,OwnerMember,Owner Member
Contacts,OwnerMemberID,Owner Member ID
Contacts,OwnerMemberKey,Owner Member Key
Contacts,Pager,Pager
Contacts,PhoneTTYTDD,Phone Tty/Tdd
Contacts,PreferredAddress,Preferred Address
Contacts,PreferredPhone,Preferred Phone
Contacts,ReferredBy,Referred By
Contacts,ReverseProspectingEnabledYN,Reverse Prospecting Enabled Yes/No
Contacts,SocialMediaType,Social Media Type
Contacts,SourceSystem,Source System
Contacts,SourceSystemContactKey,Source System Contact Key
Contacts,SourceSystemID,Source System ID
Contacts,SourceSystemName,Source System Name
Contacts,SpousePartnerName,Spouse Partner Name
Contacts,TollFreePhone,Toll Free Phone
Contacts,VoiceMail,Voice Mail
Contacts,VoiceMailExt,Voice Mail Ext
Contacts,WorkAddress1,Work Address 1
Contacts,WorkAddress2,Work Address 2
Contacts,WorkCarrierRoute,Work Carrier Route
Contacts,WorkCity,Work City
Contacts,WorkCountry,Work Country
Contacts,WorkCountyOrParish,Work County Or Parish
Contacts,WorkPostalCode,Work Postal Code
Contacts,WorkPostalCodePlus4,Work Postal Code Plus 4
Contacts,WorkStateOrProvince,Work State Or Province
EntityEvent,EntityEventSequence,Entity Event Sequence
EntityEvent,ResourceName,Resource Name
EntityEvent,ResourceRecordKey,Resource Record Key
EntityEvent,ResourceRecordUrl,Resource Record URL
Field,FieldKey,Field Key
Field,FieldName,Field Name
Field,ModificationTimestamp,Modification Timestamp
Field,ResourceName,Resource Name
HistoryTransactional,ChangedByMember,Changed By Member
HistoryTransactional,ChangedByMemberID,Changed By Member ID
HistoryTransactional,ChangedByMemberKey,Changed By Member Key
HistoryTransactional,ChangeType,Change Type
HistoryTransactional,ClassName,Class Name
HistoryTransactional,EntityEventSequence,Entity Event Sequence
HistoryTransactional,FieldKey,Field Key
HistoryTransactional,FieldName,Field Name
HistoryTransactional,HistoryTransactionalKey,History Transactional Key
HistoryTransactional,ModificationTimestamp,Modification Timestamp
HistoryTransactional,NewValue,New Value
HistoryTransactional,OriginatingSystem,Originating System
HistoryTransactional,OriginatingSystemHistoryKey,Originating System History Key
HistoryTransactional,OriginatingSystemID,Originating System ID
HistoryTransactional,OriginatingSystemName,Originating System Name
HistoryTransactional,PreviousValue,Previous Value
HistoryTransactional,ResourceName,Resource Name
HistoryTransactional,ResourceRecordID,Resource Record ID
HistoryTransactional,ResourceRecordKey,Resource Record Key
HistoryTransactional,SourceSystem,Source System
HistoryTransactional,SourceSystemHistoryKey,Source System History Key
HistoryTransactional,SourceSystemID,Source System ID
HistoryTransactional,SourceSystemName,Source System Name
InternetTracking,ActorCity,Actor City
InternetTracking,ActorEmail,Actor Email
InternetTracking,ActorID,Actor ID
InternetTracking,ActorIP,Actor IP
InternetTracking,ActorKey,Actor Key
InternetTracking,ActorLatitude,Actor Latitude
InternetTracking,ActorLongitude,Actor Longitude
InternetTracking,ActorOriginatingSystem,Actor Originating System
InternetTracking,ActorOriginatingSystemID,Actor Originating System ID
InternetTracking,ActorOriginatingSystemName,Actor Originating System Name
InternetTracking,ActorPhone,Actor Phone
InternetTracking,ActorPhoneExt,Actor Phone Ext
InternetTracking,ActorPostalCode,Actor Postal Code
InternetTracking,ActorPostalCodePlus4,Actor Postal Code Plus4
InternetTracking,ActorRegion,Actor Region
InternetTracking,ActorSourceSystem,Actor Source System
InternetTracking,ActorSourceSystemID,Actor Source System ID
InternetTracking,ActorSourceSystemName,Actor Source System Name
InternetTracking,ActorStateOrProvince,Actor State Or Province
InternetTracking,ActorType,Actor Type
InternetTracking,ColorDepth,Color Depth
InternetTracking,DeviceType,Device Type
InternetTracking,EventDescription,Event Description
InternetTracking,EventKey,Event Key
InternetTracking,EventLabel,Event Label
InternetTracking,EventOriginatingSystem,Event Originating System
InternetTracking,EventOriginatingSystemID,Event Originating System ID
InternetTracking,EventOriginatingSystemName,Event Originating System Name
InternetTracking,EventReportedTimestamp,Event Reported Timestamp
InternetTracking,EventSource,Event Source
InternetTracking,EventSourceSystem,Event Source System
InternetTracking,EventSourceSystemID,Event Source System ID
InternetTracking,EventSourceSystemName,Event Source System Name
InternetTracking,EventTarget,Event Target
InternetTracking,EventTimestamp,Event Timestamp
InternetTracking,EventType,Event Type
InternetTracking,ObjectID,Object ID
InternetTracking,ObjectIdType,Object ID Type
InternetTracking,ObjectKey,Object Key
InternetTracking,ObjectOriginatingSystem,Object Originating System
InternetTracking,ObjectOriginatingSystemID,Object Originating System ID
InternetTracking,ObjectOriginatingSystemName,Object Originating System Name
InternetTracking,ObjectSourceSystem,Object Source System
InternetTracking,ObjectSourceSystemID,Object Source System ID
InternetTracking,ObjectSourceSystemName,Object Source System Name
InternetTracking,ObjectType,Object Type
InternetTracking,ObjectURL,Object URL
InternetTracking,OriginatingSystemActorKey,Originating System Actor Key
InternetTracking,OriginatingSystemEventKey,Originating System Event Key
InternetTracking,OriginatingSystemObjectKey,Originating System Object Key
InternetTracking,ReferringURL,Referring URL
InternetTracking,ScreenHeight,Screen Height
InternetTracking,ScreenWidth,Screen Width
InternetTracking,SessionID,Session ID
InternetTracking,SourceSystemActorKey,Source System Actor Key
InternetTracking,SourceSystemEventKey,Source System Event Key
InternetTracking,SourceSystemObjectKey,Source System Object Key
InternetTracking,TimeZoneOffset,Time Zone Offset
InternetTracking,UserAgent,User Agent
InternetTrackingSummary,EndTimestamp,End Timestamp
InternetTrackingSummary,InternetTrackingSummaryKey,Internet Tracking Summary Key
InternetTrackingSummary,ListingId,Listing ID
InternetTrackingSummary,MobileLogins,Mobile Logins
InternetTrackingSummary,ModificationTimestamp,Modification Timestamp
InternetTrackingSummary,OriginatingSystemName,Originating System Name
InternetTrackingSummary,ResponseType,Response Type
InternetTrackingSummary,StartTimestamp,Start Timestamp
InternetTrackingSummary,CmaCreatedCount,CMA Created Count
InternetTrackingSummary,CmaEmailedCount,CMA Emailed Count
InternetTrackingSummary,CmaRanCount,CMA Ran Count
InternetTrackingSummary,CmaSharedCount,CMA Shared Count
InternetTrackingSummary,InquiryCount,Inquiry Count
InternetTrackingSummary,ImpressionCount,Impression Count
InternetTrackingSummary,MobileAppImpressionCount,Mobile App Impression Count
InternetTrackingSummary,ListingsEmailedCount,Listings Emailed Count
InternetTrackingSummary,FavoritedCount,Favorited Count
InternetTrackingSummary,SharedCount,Shared Count
InternetTrackingSummary,ViewCount,View Count
InternetTrackingSummary,MobileAppViewCount,Mobile App View Count
InternetTrackingSummary,TotalLogins,Total Logins
InternetTrackingSummary,ShowingCompletedCount,Showing Completed Count
InternetTrackingSummary,ShowingRequestedCount,Showing Requested Count
InternetTrackingSummary,TrackingDate,Tracking Date
InternetTrackingSummary,TrackingType,Tracking Type
InternetTrackingSummary,TrackingValues,Tracking Values
InternetTrackingSummary,UniqueLogins,Unique Logins
LockOrBox,HistoryTransactional,History Transactional
LockOrBox,KeyOrCredentialId,Key or Credential ID
LockOrBox,ListAgentFullName,List Agent Full Name
LockOrBox,ListingAddress1,Listing Address 1
LockOrBox,ListingAddress2,Listing Address 2
LockOrBox,ListingCity,Listing City
LockOrBox,ListingCountry,Listing Country
LockOrBox,ListingId,Listing ID
LockOrBox,ListingKey,Listing Key
LockOrBox,ListingLatitude,Listing Latitude
LockOrBox,ListingLongitude,Listing Longitude
LockOrBox,ListingPostalCode,Listing Postal Code
LockOrBox,ListingPostalCodePlus4,Listing Postal Code Plus 4
LockOrBox,ListingStateOrProvince,Listing State or Province
LockOrBox,ListingTimeZone,Listing Time Zone
LockOrBox,LockOrBoxAccessTimestamp,Lock or Box Access Timestamp
LockOrBox,LockOrBoxAccessType,Lock or Box Access Type
LockOrBox,LockOrBoxId,Lock or Box ID
LockOrBox,LockOrBoxInstalledTimestamp,Lock or Box Installed Timestamp
LockOrBox,LockOrBoxKey,Lock or Box Key
LockOrBox,LockOrBoxOriginatingSystemId,Lock or Box Originating System ID
LockOrBox,LockOrBoxOriginatingSystemKey,Lock or Box Originating System Key
LockOrBox,LockOrBoxOriginatingSystemName,Lock or Box Originating System Name
LockOrBox,LockOrBoxSourceSystemId,Lock or Box Source System ID
LockOrBox,LockOrBoxSourceSystemKey,Lock or Box Source System Key
LockOrBox,LockOrBoxSourceSystemName,Lock or Box Source System Name
LockOrBox,ModificationTimestamp,Modification Timestamp
LockOrBox,Notes,Notes
LockOrBox,OriginatingSystem,Originating System
LockOrBox,ShowingAgent,Showing Agent
LockOrBox,ShowingAgentAOR,Showing Agent AOR
LockOrBox,ShowingAgentEmail,Showing Agent Email
LockOrBox,ShowingAgentFirstName,Showing Agent First Name
LockOrBox,ShowingAgentFullName,Showing Agent Full Name
LockOrBox,ShowingAgentId,Showing Agent ID
LockOrBox,ShowingAgentLastName,Showing Agent Last Name
LockOrBox,ShowingAgentMlsId,Showing Agent MLS ID
LockOrBox,ShowingAgentPhone,Showing Agent Phone
LockOrBox,ShowingAgentPhoneExt,Showing Agent Phone Extension
LockOrBox,ShowingOffice,Showing Office
LockOrBox,ShowingOfficeId,Showing Office ID
LockOrBox,ShowingOfficeName,Showing Office Name
LockOrBox,ShowingOfficePhone,Showing Office Phone
LockOrBox,SourceSystem,Source System
Lookup,LegacyODataValue,Legacy OData Value
Lookup,LookupKey,Lookup Key
Lookup,LookupName,Lookup Name
Lookup,LookupValue,Lookup Value
Lookup,ModificationTimestamp,Modification Timestamp
Lookup,StandardLookupValue,Lookup Display Name
Media,ChangedByMember,Changed By Member
Media,ChangedByMemberID,Changed By Member ID
Media,ChangedByMemberKey,Changed By Member Key
Media,ClassName,Class Name
Media,HistoryTransactional,History Transactional
Media,ImageHeight,Image Height
Media,ImageOf,Image Of
Media,ImageSizeDescription,Image Size Description
Media,ImageWidth,Image Width
Media,LongDescription,Long Description
Media,MediaAlteration,Media Alteration
Media,MediaCategory,Media Category
Media,MediaHTML,Media HTML
Media,MediaKey,Media Key
Media,MediaModificationTimestamp,Media Modification Timestamp
Media,MediaObjectID,Media Object ID
Media,MediaStatus,Media Status
Media,MediaType,Media Type
Media,MediaURL,Media URL
Media,ModificationTimestamp,Modification Timestamp
Media,Order,Order
Media,OriginatingSystem,Originating System
Media,OriginatingSystemID,Originating System ID
Media,OriginatingSystemMediaKey,Originating System Media Key
Media,OriginatingSystemName,Originating System Name
Media,OriginatingSystemResourceRecordId,Originating System Resource Record ID
Media,OriginatingSystemResourceRecordKey,Originating System Resource Record Key
Media,OriginatingSystemResourceRecordSystemId,Originating System Resource Record System ID
Media,Permission,Permission
Media,PreferredPhotoYN,Preferred Photo Yes/No
Media,ResourceName,Resource Name
Media,ResourceRecordID,Resource Record ID
Media,ResourceRecordKey,Resource Record Key
Media,ShortDescription,Short Description
Media,SourceSystem,Source System
Media,SourceSystemID,Source System ID
Media,SourceSystemMediaKey,Source System Media Key
Media,SourceSystemName,Source System Name
Media,SourceSystemResourceRecordId,Source System Resource Record ID
Media,SourceSystemResourceRecordKey,Source System Resource Record Key
Media,SourceSystemResourceRecordSystemId,Source System Resource Record System ID
Member,HistoryTransactional,History Transactional
Member,JobTitle,Job Title
Member,LastLoginTimestamp,Last Login Timestamp
Member,Media,Media
Member,MemberAddress1,Member Address 1
Member,MemberAddress2,Member Address 2
Member,MemberAlternateId,Member Alternate ID
Member,MemberAOR,Member AOR
Member,MemberAORkey,Member AOR Key
Member,MemberAORMlsId,Member AOR MLS ID
Member,MemberAssociationComments,Member Association Comments
Member,MemberBillingPreference,Member Billing Preference
Member,MemberBio,Member Bio
Member,MemberCarrierRoute,Member Carrier Route
Member,MemberCity,Member City
Member,MemberCommitteeCount,Member Committee Count
Member,MemberCountry,Member Country
Member,MemberCountyOrParish,Member County Or Parish
Member,MemberDesignation,Member Designation
Member,MemberDirectPhone,Member Direct Phone
Member,MemberEmail,Member Email
Member,MemberFax,Member Fax
Member,MemberFirstName,Member First Name
Member,MemberFullName,Member Full Name
Member,MemberHomePhone,Member Home Phone
Member,MemberIsAssistantTo,Member Is Assistant To
Member,MemberKey,Member Key
Member,MemberLanguages,Member Languages
Member,MemberLastName,Member Last Name
Member,MemberLoginId,Member Login ID
Member,MemberMailOptOutYN,Member Mail Opt Out Y/N
Member,MemberMiddleName,Member Middle Name
Member,MemberMlsAccessYN,Member MLS Access Yes/No
Member,MemberMlsId,Member MLS ID
Member,MemberMlsSecurityClass,Member MLS Security Class
Member,MemberMobilePhone,Member Mobile Phone
Member,MemberNamePrefix,Member Name Prefix
Member,MemberNameSuffix,Member Name Suffix
Member,MemberNationalAssociationEntryDate,Member National Association Entry Date
Member,MemberNationalAssociationId,Member National Association ID
Member,MemberNickname,Member Nickname
Member,MemberOfficePhone,Member Office Phone
Member,MemberOfficePhoneExt,Member Office Phone Ext
Member,MemberOtherPhone,Member Other Phone
Member,MemberOtherPhoneType,Member Other Phone Type
Member,MemberPager,Member Pager
Member,MemberPassword,Member Password
Member,MemberPhoneTTYTDD,Member Phone Tty/Tdd
Member,MemberPostalCode,Member Postal Code
Member,MemberPostalCodePlus4,Member Postal Code Plus 4
Member,MemberPreferredMail,Member Preferred Mail
Member,MemberPreferredMedia,Member Preferred Media
Member,MemberPreferredPhone,Member Preferred Phone
Member,MemberPreferredPhoneExt,Member Preferred Phone Ext
Member,MemberPreferredPublication,Member Preferred Publication
Member,MemberPrimaryAorId,Member Primary AOR ID
Member,MemberSocialMedia,Member Social Media
Member,MemberStateLicense,Member State License
Member,MemberStateLicenseExpirationDate,Member State License Expiration Date
Member,MemberStateLicenseState,Member State License State
Member,MemberStateLicenseType,Member State License Type
Member,MemberStateOrProvince,Member State Or Province
Member,MemberStatus,Member Status
Member,MemberTollFreePhone,Member Toll Free Phone
Member,MemberTransferDate,Member Transfer Date
Member,MemberType,Member Type
Member,MemberVoiceMail,Member Voice Mail
Member,MemberVoiceMailExt,Member Voice Mail Ext
Member,MemberVotingPrecinct,Member Voting Precinct
Member,ModificationTimestamp,Modification Timestamp
Member,Office,Office
Member,OfficeKey,Office Key
Member,OfficeMlsId,Office MLS ID
Member,OfficeName,Office Name
Member,OfficeNationalAssociationId,Office National Association ID
Member,OriginalEntryTimestamp,Original Entry Timestamp
Member,OriginatingSystem,Originating System
Member,OriginatingSystemID,Originating System ID
Member,OriginatingSystemMemberKey,Originating System Member Key
Member,OriginatingSystemName,Originating System Name
Member,SocialMediaType,Social Media Type
Member,SourceSystem,Source System
Member,SourceSystemID,Source System ID
Member,SourceSystemMemberKey,Source System Member Key
Member,SourceSystemName,Source System Name
Member,SyndicateTo,Syndicate To
Member,UniqueLicenseeIdentifier,Unique Licensee Identifier
MemberAssociation,Association,Association
MemberAssociation,AssociationKey,Association Key
MemberAssociation,AssociationMlsId,Association MLS ID
MemberAssociation,AssociationNationalAssociationId,Association National Association ID
MemberAssociation,AssociationStaffYN,Association Staff Yes/No
MemberAssociation,HistoryTransactional,History Transactional
MemberAssociation,JoinDate,Join Date
MemberAssociation,Member,Member
MemberAssociation,MemberAssociationBillStatus,Member Association Bill Status
MemberAssociation,MemberAssociationBillStatusDescription,Member Association Bill Status Description
MemberAssociation,MemberAssociationDuesPaidDate,Member Association Dues Paid Date
MemberAssociation,MemberAssociationJoinDate,Member Association Join Date
MemberAssociation,MemberAssociationModificationDateTime,Member Association Modification Date Time
MemberAssociation,MemberAssociationOrientationDate,Member Association Orientation Date
MemberAssociation,MemberAssociationPrimaryIndicator,Member Association Primary Indicator
MemberAssociation,MemberAssociationStatus,Member Association Status
MemberAssociation,MemberAssociationStatusDate,Member Association Status Date
MemberAssociation,MemberKey,Member Key
MemberAssociation,MemberLocalDuesWaivedYN,Member Local Dues Waived Yes/No
MemberAssociation,MemberMlsId,Member MLS ID
MemberAssociation,MemberNationalDuesWaivedYN,Member National Dues Waived Yes/No
MemberAssociation,MemberStatelDuesWaivedYN,Member State Dues Waived Yes/No
MemberAssociation,ModificationTimestamp,Modification Timestamp
MemberAssociation,Office,Office
MemberAssociation,OfficeAssociationPrimaryIndicator,Office Association Primary Indicator
MemberAssociation,OfficeAssociationStatus,Office Association Status
MemberAssociation,OfficeAssociationStatusDate,Office Association Status Date
MemberAssociation,OfficeKey,Office Key
MemberAssociation,OfficeMlsId,Office MLS ID
MemberAssociation,OriginalEntryTimestamp,Original Entry Timestamp
MemberAssociation,OriginatingSystem,Originating System
MemberAssociation,OriginatingSystemId,Originating System ID
MemberAssociation,OriginatingSystemMemberKey,Originating System Member Key
MemberAssociation,OriginatingSystemName,Originating System Name
MemberAssociation,SourceSystem,Source System
MemberAssociation,SourceSystemId,Source System ID
MemberAssociation,SourceSystemMemberKey,Source System Member Key
MemberAssociation,SourceSystemName,Source System Name
MemberStateLicense,HistoryTransactional,History Transactional
MemberStateLicense,Member,Member
MemberStateLicense,MemberKey,Member Key
MemberStateLicense,MemberMlsId,Member MLS ID
MemberStateLicense,MemberStateLicense,Member State License
MemberStateLicense,MemberStateLicenseExpirationDate,Member State License Expiration Date
MemberStateLicense,MemberStateLicenseKey,Member State License Key
MemberStateLicense,MemberStateLicenseState,Member State License State
MemberStateLicense,MemberStateLicenseType,Member State License Type
MemberStateLicense,ModificationTimestamp,Modification Timestamp
Office,BillingOfficeKey,Billing Office Key
Office,FranchiseAffiliation,Franchise Affiliation
Office,FranchiseNationalAssociationId,Franchise National Association ID
Office,HistoryTransactional,History Transactional
Office,IDXOfficeParticipationYN,IDX Office Participation Yes/No
Office,MainOffice,Main Office
Office,MainOfficeKey,Main Office Key
Office,MainOfficeMlsId,Main Office MLS ID
Office,Media,Media
Office,ModificationTimestamp,Modification Timestamp
Office,NumberOfBranches,Number of Branches
Office,NumberOfNonMemberSalespersons,Number of Non Member Salespersons
Office,OfficeAddress1,Office Address 1
Office,OfficeAddress2,Office Address 2
Office,OfficeAlternateId,Office Alternate ID
Office,OfficeAOR,Office AOR
Office,OfficeAORkey,Office AOR Key
Office,OfficeAORMlsId,Office AOR MLS ID
Office,OfficeAssociationComments,Office Association Comments
Office,OfficeBio,Office Bio
Office,OfficeBranchType,Office Branch Type
Office,OfficeBroker,Office Broker
Office,OfficeBrokerKey,Office Broker Key
Office,OfficeBrokerMlsId,Office Broker MLS ID
Office,OfficeBrokerNationalAssociationId,Office Broker National Association ID
Office,OfficeCity,Office City
Office,OfficeCorporateLicense,Office Corporate License
Office,OfficeCountry,Office Country
Office,OfficeCountyOrParish,Office County Or Parish
Office,OfficeEmail,Office Email
Office,OfficeFax,Office Fax
Office,OfficeKey,Office Key
Office,OfficeMailAddress1,Office Mail Address 1
Office,OfficeMailAddress2,Office Mail Address 2
Office,OfficeMailCareOf,Office Mail Care Of
Office,OfficeMailCity,Office Mail City
Office,OfficeMailCountry,Office Mail Country
Office,OfficeMailCountyOrParish,Office Mail County or Parish
Office,OfficeMailPostalCode,Office Mail Postal Code
Office,OfficeMailPostalCodePlus4,Office Mail Postal Code Plus 4
Office,OfficeMailStateOrProvince,Office Mail State or Province
Office,OfficeManager,Office Manager
Office,OfficeManagerKey,Office Manager Key
Office,OfficeManagerMlsId,Office Manager MLS ID
Office,OfficeMlsId,Office MLS ID
Office,OfficeName,Office Name
Office,OfficeNationalAssociationId,Office National Association ID
Office,OfficeNationalAssociationIdInsertDate,Office National Association ID Insert Date
Office,OfficePhone,Office Phone
Office,OfficePhoneExt,Office Phone Ext
Office,OfficePostalCode,Office Postal Code
Office,OfficePostalCodePlus4,Office Postal Code Plus 4
Office,OfficePreferredMedia,Office Preferred Media
Office,OfficePrimaryAorId,Office Primary AOR ID
Office,OfficePrimaryStateOrProvince,Office Primary State or Province
Office,OfficeSocialMedia,Office Social Media
Office,OfficeStateOrProvince,Office State Or Province
Office,OfficeStatus,Office Status
Office,OfficeType,Office Type
Office,OriginalEntryTimestamp,Original Entry Timestamp
Office,OriginatingSystem,Originating System
Office,OriginatingSystemID,Originating System ID
Office,OriginatingSystemName,Originating System Name
Office,OriginatingSystemOfficeKey,Originating System Office Key
Office,OtherPhone,Other Phone
Office,SocialMediaType,Social Media Type
Office,SourceSystem,Source System
Office,SourceSystemID,Source System ID
Office,SourceSystemName,Source System Name
Office,SourceSystemOfficeKey,Source System Office Key
Office,SyndicateAgentOption,Syndicate Agent Option
Office,SyndicateTo,Syndicate To
Office,VirtualOfficeWebsiteYN,Virtual Office Website Yes/No
OfficeAssociation,Association,Association
OfficeAssociation,AssociationKey,Association Key
OfficeAssociation,AssociationMlsId,Association MLS ID
OfficeAssociation,AssociationNationalAssociationId,Association National Association ID
OfficeAssociation,BillStatus,Bill Status
OfficeAssociation,HistoryTransactional,History Transactional
OfficeAssociation,JoinDate,Join Date
OfficeAssociation,ModificationTimestamp,Modification Timestamp
OfficeAssociation,Office,Office
OfficeAssociation,OfficeAssociationPrimaryIndicator,Office Association Primary Indicator
OfficeAssociation,OfficeAssociationStatus,Office Association Status
OfficeAssociation,OfficeAssociationStatusDate,Office Association Status Date
OfficeAssociation,OfficeKey,Office Key
OfficeAssociation,OfficeMlsId,Office MLS ID
OfficeAssociation,OriginalEntryTimestamp,Original Entry Timestamp
OfficeAssociation,OriginatingSystem,Originating System
OfficeAssociation,OriginatingSystemId,Originating System ID
OfficeAssociation,OriginatingSystemMemberKey,Originating System Member Key
OfficeAssociation,OriginatingSystemName,Originating System Name
OfficeAssociation,SourceSystem,Source System
OfficeAssociation,SourceSystemId,Source System ID
OfficeAssociation,SourceSystemMemberKey,Source System Member Key
OfficeAssociation,SourceSystemName,Source System Name
OfficeCorporateLicense,HistoryTransactional,History Transactional
OfficeCorporateLicense,ModificationTimestamp,Modification Timestamp
OfficeCorporateLicense,Office,Office
OfficeCorporateLicense,OfficeCorporateLicense,Office Corporate License
OfficeCorporateLicense,OfficeCorporateLicenseExpirationDate,Office Corporate License Expiration Date
OfficeCorporateLicense,OfficeCorporateLicenseKey,Office Corporate License Key
OfficeCorporateLicense,OfficeCorporateLicenseState,Office Corporate License State
OfficeCorporateLicense,OfficeCorporateLicenseType,Office Corporate License Type
OfficeCorporateLicense,OfficeKey,Office Key
OfficeCorporateLicense,OfficeMlsId,Office MLS ID
OpenHouse,AppointmentRequiredYN,Appointment Required Yes/No
OpenHouse,HistoryTransactional,History Transactional
OpenHouse,Listing,Listing
OpenHouse,ListingId,Listing ID
OpenHouse,ListingKey,Listing Key
OpenHouse,LivestreamOpenHouseURL,Livestream Open House URL
OpenHouse,Media,Media
OpenHouse,ModificationTimestamp,Modification Timestamp
OpenHouse,OpenHouseAttendedBy,Open House Attended By
OpenHouse,OpenHouseDate,Open House Date
OpenHouse,OpenHouseEndTime,Open House End Time
OpenHouse,OpenHouseId,Open House ID
OpenHouse,OpenHouseKey,Open House Key
OpenHouse,OpenHouseRemarks,Open House Remarks
OpenHouse,OpenHouseStartTime,Open House Start Time
OpenHouse,OpenHouseStatus,Open House Status
OpenHouse,OpenHouseType,Open House Type
OpenHouse,OriginalEntryTimestamp,Original Entry Timestamp
OpenHouse,OriginatingSystem,Originating System
OpenHouse,OriginatingSystemID,Originating System ID
OpenHouse,OriginatingSystemKey,Originating System Key
OpenHouse,OriginatingSystemName,Originating System Name
OpenHouse,Refreshments,Refreshments
OpenHouse,ShowingAgent,Showing Agent
OpenHouse,ShowingAgentFirstName,Showing Agent First Name
OpenHouse,ShowingAgentKey,Showing Agent Key
OpenHouse,ShowingAgentLastName,Showing Agent Last Name
OpenHouse,ShowingAgentMlsID,Showing Agent MLS ID
OpenHouse,SocialMedia,Social Media
OpenHouse,SourceSystem,Source System
OpenHouse,SourceSystemID,Source System ID
OpenHouse,SourceSystemKey,Source System Key
OpenHouse,SourceSystemName,Source System Name
OtherPhone,ClassName,Class Name
OtherPhone,HistoryTransactional,History Transactional
OtherPhone,ModificationTimestamp,Modification Timestamp
OtherPhone,OtherPhoneExt,Other Phone Ext
OtherPhone,OtherPhoneKey,Other Phone Key
OtherPhone,OtherPhoneNumber,Other Phone Number
OtherPhone,OtherPhoneType,Other Phone Type
OtherPhone,ResourceName,Resource Name
OtherPhone,ResourceRecordID,Resource Record ID
OtherPhone,ResourceRecordKey,Resource Record Key
OUID,ChangedByMember,Changed by Member
OUID,ChangedByMemberID,Changed By Member ID
OUID,ChangedByMemberKey,Changed By Member Key
OUID,HistoryTransactional,History Transactional
OUID,Media,Media
OUID,ModificationTimestamp,Modification Timestamp
OUID,OrganizationAddress1,Organization Address 1
OUID,OrganizationAddress2,Organization Address 2
OUID,OrganizationAOR,Organization AOR
OUID,OrganizationAorOuid,Organization AOR OUID
OUID,OrganizationAorOuidKey,Organization AOR OUID Key
OUID,OrganizationCarrierRoute,Organization Carrier Route
OUID,OrganizationCity,Organization City
OUID,OrganizationComments,Organization Comments
OUID,OrganizationContactEmail,Organization Contact Email
OUID,OrganizationContactFax,Organization Contact Fax
OUID,OrganizationContactFirstName,Organization Contact First Name
OUID,OrganizationContactFullName,Organization Contact Full Name
OUID,OrganizationContactJobTitle,Organization Contact Job Title
OUID,OrganizationContactLastName,Organization Contact Last Name
OUID,OrganizationContactMiddleName,Organization Contact Middle Name
OUID,OrganizationContactNamePrefix,Organization Contact Name Prefix
OUID,OrganizationContactNameSuffix,Organization Contact Name Suffix
OUID,OrganizationContactPhone,Organization Contact Phone
OUID,OrganizationContactPhoneExt,Organization Contact Phone Ext
OUID,OrganizationCountry,Organization Country
OUID,OrganizationCountyOrParish,Organization County Or Parish
OUID,OrganizationMemberCount,Organization Member Count
OUID,OrganizationMlsCode,Organization MLS Code
OUID,OrganizationMlsVendorName,Organization MLS Vendor Name
OUID,OrganizationMlsVendorOuid,Organization MLS Vendor OUID
OUID,OrganizationName,Organization Name
OUID,OrganizationNationalAssociationId,Organization National Association ID
OUID,OrganizationPostalCode,Organization Postal Code
OUID,OrganizationPostalCodePlus4,Organization Postal Code Plus4
OUID,OrganizationSocialMedia,Organization Social Media
OUID,OrganizationSocialMediaType,Organization Social Media Type
OUID,OrganizationStateLicense,Organization State License
OUID,OrganizationStateLicenseState,Organization State License State
OUID,OrganizationStateOrProvince,Organization State Or Province
OUID,OrganizationStatus,Organization Status
OUID,OrganizationStatusChangeTimestamp,Organization Status Change Timestamp
OUID,OrganizationType,Organization Type
OUID,OrganizationUniqueId,Organization Unique ID
OUID,OrganizationUniqueIdKey,Organization Unique ID Key
OUID,OriginalEntryTimestamp,Original Entry Timestamp
PropertyPowerStorage,DateOfInstallation,Date Of Installation
PropertyPowerStorage,InformationSource,Information Source
PropertyPowerStorage,ModificationTimestamp,Modification Timestamp
PropertyPowerStorage,NameplateCapacity,Nameplate Capacity
PropertyPowerStorage,PowerStorageKey,Power Storage Key
PropertyPowerStorage,PowerStorageType,Power Storage Type
PropertyGreenVerification,GreenBuildingVerificationKey,Green Building Verification Key
PropertyGreenVerification,GreenBuildingVerificationType,Green Building Verification Type
PropertyGreenVerification,GreenVerificationBody,Green Verification Body
PropertyGreenVerification,GreenVerificationMetric,Green Verification Metric
PropertyGreenVerification,GreenVerificationRating,Green Verification Rating
PropertyGreenVerification,GreenVerificationSource,Green Verification Source
PropertyGreenVerification,GreenVerificationStatus,Green Verification Status
PropertyGreenVerification,GreenVerificationURL,Green Verification URL
PropertyGreenVerification,GreenVerificationVersion,Green Verification Version
PropertyGreenVerification,GreenVerificationYear,Green Verification Year
PropertyGreenVerification,HistoryTransactional,History Transactional
PropertyGreenVerification,Listing,Listing
PropertyGreenVerification,ListingId,Listing ID
PropertyGreenVerification,ListingKey,Listing Key
PropertyGreenVerification,ModificationTimestamp,Modification Timestamp
PropertyPowerProduction,HistoryTransactional,History Transactional
PropertyPowerProduction,Listing,Listing
PropertyPowerProduction,ListingId,Listing ID
PropertyPowerProduction,ListingKey,Listing Key
PropertyPowerProduction,ModificationTimestamp,Modification Timestamp
PropertyPowerProduction,PowerProductionAnnual,Power Production Annual
PropertyPowerProduction,PowerProductionAnnualStatus,Power Production Annual Status
PropertyPowerProduction,PowerProductionKey,Power Production Key
PropertyPowerProduction,PowerProductionOwnership,Power Production Ownership
PropertyPowerProduction,PowerProductionSize,Power Production Size
PropertyPowerProduction,PowerProductionType,Power Production Type
PropertyPowerProduction,PowerProductionYearInstall,Power Production Year Install
PropertyRooms,BedroomClosetType,Bedroom Closet Type
PropertyRooms,HistoryTransactional,History Transactional
PropertyRooms,Listing,Listing
PropertyRooms,ListingId,Listing ID
PropertyRooms,ListingKey,Listing Key
PropertyRooms,ModificationTimestamp,Modification Timestamp
PropertyRooms,RoomArea,Room Area
PropertyRooms,RoomAreaSource,Room Area Source
PropertyRooms,RoomAreaUnits,Room Area Units
PropertyRooms,RoomDescription,Room Description
PropertyRooms,RoomDimensions,Room Dimensions
PropertyRooms,RoomFeatures,Room Features
PropertyRooms,RoomKey,Room Key
PropertyRooms,RoomLength,Room Length
PropertyRooms,RoomLengthWidthSource,Room Length Width Source
PropertyRooms,RoomLengthWidthUnits,Room Length Width Units
PropertyRooms,RoomLevel,Room Level
PropertyRooms,RoomType,Room Type
PropertyRooms,RoomWidth,Room Width
PropertyUnitTypes,HistoryTransactional,History Transactional
PropertyUnitTypes,Listing,Listing
PropertyUnitTypes,ListingId,Listing ID
PropertyUnitTypes,ListingKey,Listing Key
PropertyUnitTypes,ModificationTimestamp,Modification Timestamp
PropertyUnitTypes,UnitTypeActualRent,Unit Type Actual Rent
PropertyUnitTypes,UnitTypeBathsTotal,Unit Type Baths Total
PropertyUnitTypes,UnitTypeBedsTotal,Unit Type Beds Total
PropertyUnitTypes,UnitTypeDescription,Unit Type Description
PropertyUnitTypes,UnitTypeFurnished,Unit Type Furnished
PropertyUnitTypes,UnitTypeGarageAttachedYN,Unit Type Garage Attached Yes/No
PropertyUnitTypes,UnitTypeGarageSpaces,Unit Type Garage Spaces
PropertyUnitTypes,UnitTypeKey,Unit Type Key
PropertyUnitTypes,UnitTypeProForma,Unit Type Pro Forma
PropertyUnitTypes,UnitTypeTotalRent,Unit Type Total Rent
PropertyUnitTypes,UnitTypeType,Unit Type Type
PropertyUnitTypes,UnitTypeUnitsTotal,Unit Type Units Total
Prospecting,ActiveYN,Active Yes/No
Prospecting,BccEmailList,BCC Email List
Prospecting,BccMeYN,BCC Me Yes/No
Prospecting,CcEmailList,CC Email List
Prospecting,ClientActivatedYN,Client Activated Yes/No
Prospecting,ConciergeNotificationsYN,Concierge Notifications Yes/No
Prospecting,ConciergeYN,Concierge Yes/No
Prospecting,Contact,Contact
Prospecting,ContactKey,Contact Key
Prospecting,DailySchedule,Daily Schedule
Prospecting,DisplayTemplateID,Display Template ID
Prospecting,HistoryTransactional,History Transactional
Prospecting,Language,Language
Prospecting,LastNewChangedTimestamp,Last New Changed Timestamp
Prospecting,LastViewedTimestamp,Last Viewed Timestamp
Prospecting,Media,Media
Prospecting,MessageNew,Message New
Prospecting,MessageRevise,Message Revise
Prospecting,MessageUpdate,Message Update
Prospecting,ModificationTimestamp,Modification Timestamp
Prospecting,NextSendTimestamp,Next Send Timestamp
Prospecting,OwnerMember,Owner Member
Prospecting,OwnerMemberID,Owner Member ID
Prospecting,OwnerMemberKey,Owner Member Key
Prospecting,ProspectingKey,Prospecting Key
Prospecting,ReasonActiveOrDisabled,Reason Active Or Disabled
Prospecting,SavedSearch,Saved Search
Prospecting,SavedSearchKey,Saved Search Key
Prospecting,ScheduleType,Schedule Type
Prospecting,Subject,Subject
Prospecting,ToEmailList,To Email List
Queue,ClassName,Class Name
Queue,HistoryTransactional,History Transactional
Queue,ModificationTimestamp,Modification Timestamp
Queue,OriginatingSystem,Originating System
Queue,OriginatingSystemID,Originating System ID
Queue,OriginatingSystemName,Originating System Name
Queue,OriginatingSystemQueueKey,Originating System Queue Key
Queue,QueueTransactionKey,Queue Transaction Key
Queue,QueueTransactionType,Queue Transaction Type
Queue,ResourceName,Resource Name
Queue,ResourceRecordID,Resource Record ID
Queue,ResourceRecordKey,Resource Record Key
Queue,SourceSystem,Source System
Queue,SourceSystemID,Source System ID
Queue,SourceSystemName,Source System Name
Queue,SourceSystemQueueKey,Source System Queue Key
Rules,ClassName,Class Name
Rules,FieldKey,Field Key
Rules,FieldName,Field Name
Rules,HistoryTransactional,History Transactional
Rules,ModificationTimestamp,Modification Timestamp
Rules,OriginalEntryTimestamp,Original Entry Timestamp
Rules,OriginatingSystem,Originating System
Rules,OriginatingSystemID,Originating System ID
Rules,OriginatingSystemName,Originating System Name
Rules,OriginatingSystemRuleKey,Originating System Rule Key
Rules,ResourceName,Resource Name
Rules,RuleAction,Rule Action
Rules,RuleDescription,Rule Description
Rules,RuleEnabledYN,Rule Enabled Yes/No
Rules,RuleErrorText,Rule Error Text
Rules,RuleExpression,Rule Expression
Rules,RuleFormat,Rule Format
Rules,RuleHelpText,Rule Help Text
Rules,RuleKey,Rule Key
Rules,RuleName,Rule Name
Rules,RuleOrder,Rule Order
Rules,RuleType,Rule Type
Rules,RuleVersion,Rule Version
Rules,RuleWarningText,Rule Warning Text
Rules,SourceSystem,Source System
Rules,SourceSystemHistoryKey,Source System History Key
Rules,SourceSystemID,Source System ID
Rules,SourceSystemName,Source System Name
SavedSearch,ClassName,Class Name
SavedSearch,HistoryTransactional,History Transactional
SavedSearch,Member,Member
SavedSearch,MemberKey,Member Key
SavedSearch,MemberMlsId,Member MLS ID
SavedSearch,ModificationTimestamp,Modification Timestamp
SavedSearch,OriginalEntryTimestamp,Original Entry Timestamp
SavedSearch,OriginatingSystem,Originating System
SavedSearch,OriginatingSystemID,Originating System ID
SavedSearch,OriginatingSystemKey,Originating System Key
SavedSearch,OriginatingSystemMemberKey,Originating System Member Key
SavedSearch,OriginatingSystemMemberName,Originating System Member Name
SavedSearch,OriginatingSystemName,Originating System Name
SavedSearch,ResourceName,Resource Name
SavedSearch,SavedSearchDescription,Saved Search Description
SavedSearch,SavedSearchKey,Saved Search Key
SavedSearch,SavedSearchName,Saved Search Name
SavedSearch,SavedSearchType,Saved Search Type
SavedSearch,SearchQuery,Search Query
SavedSearch,SearchQueryExceptionDetails,Search Query Exception Details
SavedSearch,SearchQueryExceptions,Search Query Exceptions
SavedSearch,SearchQueryHumanReadable,Search Query Human Readable
SavedSearch,SearchQueryType,Search Query Type
SavedSearch,SourceSystem,Source System
SavedSearch,SourceSystemID,Source System ID
SavedSearch,SourceSystemKey,Source System Key
SavedSearch,SourceSystemName,Source System Name
Showing,AgentOriginatingSystem,Agent Originating System
Showing,AgentOriginatingSystemID,Agent Originating System ID
Showing,AgentOriginatingSystemName,Agent Originating System Name
Showing,AgentSourceSystem,Agent Source System
Showing,AgentSourceSystemID,Agent Source System ID
Showing,AgentSourceSystemName,Agent Source System Name
Showing,HistoryTransactional,History Transactional
Showing,Listing,Listing
Showing,ListingId,Listing ID
Showing,ListingKey,Listing Key
Showing,ListingOriginatingSystem,Listing Originating System
Showing,ListingOriginatingSystemID,Listing Originating System ID
Showing,ListingOriginatingSystemName,Listing Originating System Name
Showing,ListingSourceSystem,Listing Source System
Showing,ListingSourceSystemID,Listing Source System ID
Showing,ListingSourceSystemName,Listing Source System Name
Showing,Media,Media
Showing,ModificationTimestamp,Modification Timestamp
Showing,OriginalEntryTimestamp,Original Entry Timestamp
Showing,OriginatingSystemAgentKey,Originating System Agent Key
Showing,OriginatingSystemListingKey,Originating System Listing Key
Showing,OriginatingSystemShowingKey,Originating System Showing Key
Showing,ShowingAgent,Showing Agent
Showing,ShowingAgentKey,Showing Agent Key
Showing,ShowingAgentMlsID,Showing Agent MLS ID
Showing,ShowingAllowed,Showings Allowed
Showing,ShowingEndTimestamp,Showing End Timestamp
Showing,ShowingId,Showing ID
Showing,ShowingKey,Showing Key
Showing,ShowingOriginatingSystem,Showing Originating System
Showing,ShowingOriginatingSystemID,Showing Originating System ID
Showing,ShowingOriginatingSystemName,Showing Originating System Name
Showing,ShowingRequestedTimestamp,Showing Requested Timestamp
Showing,ShowingSourceSystem,Showing Source System
Showing,ShowingSourceSystemID,Showing Source System ID
Showing,ShowingSourceSystemName,Showing Source System Name
Showing,ShowingStartTimestamp,Showing Start Timestamp
Showing,ShowingStatus,Showing Status
Showing,ShowingTimeZone,Showing Time Zone
Showing,ShowingUrl,Showing Deep Link URL
Showing,SocialMedia,Social Media
Showing,SourceSystemAgentKey,Source System Agent Key
Showing,SourceSystemListingKey,Source System Listing Key
Showing,SourceSystemShowingKey,Source System Showing Key
ShowingAppointment,ModificationTimestamp,Modification Timestamp
ShowingAppointment,ShowingAgentKey,Showing Agent Key
ShowingAppointment,ShowingAgentMlsId,Showing Agent MLS ID
ShowingAppointment,ShowingAppointmentDate,Showing Appointment Date
ShowingAppointment,ShowingAppointmentEndTime,Showing Appointment End Time
ShowingAppointment,ShowingAppointmentId,Showing Appointment ID
ShowingAppointment,ShowingAppointmentKey,Showing Appointment Key
ShowingAppointment,ShowingAppointmentMethod,Showing Appointment Method
ShowingAppointment,ShowingAppointmentStartTime,Showing Appointment Start Time
ShowingAppointment,ShowingAppointmentStatus,Showing Appointment Status
ShowingAppointment,ShowingId,Showing ID
ShowingAppointment,ShowingKey,Showing Key
ShowingAvailability,ModificationTimestamp,Modification Timestamp
ShowingAvailability,ShowingAvailabilityKey,Showing Availability Key
ShowingAvailability,ShowingAvailableEndTime,Showing Available End Time
ShowingAvailability,ShowingAvailableStartTime,Showing Available Start Time
ShowingAvailability,ShowingDate,Showing Date
ShowingAvailability,ShowingId,Showing ID
ShowingAvailability,ShowingKey,Showing Key
ShowingAvailability,ShowingMaximumDuration,Showing Maximum Duration
ShowingAvailability,ShowingMethod,Showing Method
ShowingAvailability,ShowingMinimumDuration,Showing Minimum Duration
ShowingAvailability,UniqueOrganizationIdentifier,Unique Organization Identifier
ShowingAvailability,UniversalPropertyId,Universal Property ID
ShowingRequest,ModificationTimestamp,Modification Timestamp
ShowingRequest,ShowingAgentKey,Showing Agent Key
ShowingRequest,ShowingAgentMlsId,Showing Agent MLS ID
ShowingRequest,ShowingId,Showing ID
ShowingRequest,ShowingKey,Showing Key
ShowingRequest,ShowingMethodRequest,Showing Method Request
ShowingRequest,ShowingRequestDate,Showing Request Date
ShowingRequest,ShowingRequestDuration,Showing Request Duration
ShowingRequest,ShowingRequestedDate,Showing Requested Date
ShowingRequest,ShowingRequestedTimestamp,Showing Requested Timestamp
ShowingRequest,ShowingRequestEndTime,Showing Request End Time
ShowingRequest,ShowingRequestId,Showing Request ID
ShowingRequest,ShowingRequestKey,Showing Request Key
ShowingRequest,ShowingRequestNotes,Showing Request Notes
ShowingRequest,ShowingRequestor,Showing Requestor
ShowingRequest,ShowingRequestStartTime,Showing Request Start Time
ShowingRequest,ShowingRequestType,Showing Request Type
SocialMedia,ClassName,Class Name
SocialMedia,DisplayName,Display Name
SocialMedia,HistoryTransactional,History Transactional
SocialMedia,ModificationTimestamp,Modification Timestamp
SocialMedia,ResourceName,Resource Name
SocialMedia,ResourceRecordID,Resource Record ID
SocialMedia,ResourceRecordKey,Resource Record Key
SocialMedia,SocialMediaKey,Social Media Key
SocialMedia,SocialMediaType,Social Media Type
SocialMedia,SocialMediaUrlOrId,Social Media URL or ID
TeamMembers,HistoryTransactional,History Transactional
TeamMembers,Member,Member
TeamMembers,MemberKey,Member Key
TeamMembers,MemberLoginId,Member Login ID
TeamMembers,MemberMlsId,Member MLS ID
TeamMembers,ModificationTimestamp,Modification Timestamp
TeamMembers,OriginalEntryTimestamp,Original Entry Timestamp
TeamMembers,OriginatingSystem,Originating System
TeamMembers,OriginatingSystemID,Originating System ID
TeamMembers,OriginatingSystemKey,Originating System Key
TeamMembers,OriginatingSystemName,Originating System Name
TeamMembers,SourceSystem,Source System
TeamMembers,SourceSystemID,Source System ID
TeamMembers,SourceSystemKey,Source System Key
TeamMembers,SourceSystemName,Source System Name
TeamMembers,TeamImpersonationLevel,Team Impersonation Level
TeamMembers,TeamKey,Team Key
TeamMembers,TeamMemberKey,Team Member Key
TeamMembers,TeamMemberNationalAssociationId,Team Member National Association ID
TeamMembers,TeamMemberStateLicense,Team Member State License
TeamMembers,TeamMemberType,Team Member Type
Teams,HistoryTransactional,History Transactional
Teams,Media,Media
Teams,ModificationTimestamp,Modification Timestamp
Teams,OriginalEntryTimestamp,Original Entry Timestamp
Teams,OriginatingSystem,Originating System
Teams,OriginatingSystemID,Originating System ID
Teams,OriginatingSystemKey,Originating System Key
Teams,OriginatingSystemName,Originating System Name
Teams,SocialMediaType,Social Media Type
Teams,SourceSystem,Source System
Teams,SourceSystemID,Source System ID
Teams,SourceSystemKey,Source System Key
Teams,SourceSystemName,Source System Name
Teams,TeamAddress1,Team Address 1
Teams,TeamAddress2,Team Address 2
Teams,TeamCarrierRoute,Team Carrier Route
Teams,TeamCity,Team City
Teams,TeamCountry,Team Country
Teams,TeamCountyOrParish,Team County Or Parish
Teams,TeamDescription,Team Description
Teams,TeamDirectPhone,Team Direct Phone
Teams,TeamEmail,Team Email
Teams,TeamFax,Team Fax
Teams,TeamKey,Team Key
Teams,TeamLead,Team Lead
Teams,TeamLeadKey,Team Lead Key
Teams,TeamLeadLoginId,Team Lead Login ID
Teams,TeamLeadMlsId,Team Lead MLS ID
Teams,TeamLeadNationalAssociationId,Team Lead National Association ID
Teams,TeamLeadStateLicense,Team Lead State License
Teams,TeamLeadStateLicenseState,Team Lead State License State
Teams,TeamMobilePhone,Team Mobile Phone
Teams,TeamName,Team Name
Teams,TeamOfficePhone,Team Office Phone
Teams,TeamOfficePhoneExt,Team Office Phone Ext
Teams,TeamPostalCode,Team Postal Code
Teams,TeamPostalCodePlus4,Team Postal Code Plus 4
Teams,TeamPreferredPhone,Team Preferred Phone
Teams,TeamPreferredPhoneExt,Team Preferred Phone Ext
Teams,TeamsSocialMedia,Teams Social Media
Teams,TeamStateOrProvince,Team State Or Province
Teams,TeamStatus,Team Status
Teams,TeamTollFreePhone,Team Toll Free Phone
Teams,TeamVoiceMail,Team Voice Mail
Teams,TeamVoiceMailExt,Team Voice Mail Ext
TransactionManagement,TransactionId,Transaction ID
TransactionManagement,TransactionKey,Transaction Key
TransactionManagement,TransactionType,Transaction Type
TransactionManagement,ModificationTimestamp,Modification Timestamp`;

// Parse the CSV Data
const parseResoCsv = (csvText: string): ResoFieldDefinition[] => {
  const results = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim()
  });
  
  return results.data.map((row: any) => ({
    ResourceName: row.ResourceName,
    StandardName: row.StandardName,
    DisplayName: row.DisplayName
  })) as ResoFieldDefinition[];
};

// Export the full list of fields
export const RESO_STANDARD_FIELDS: ResoFieldDefinition[] = parseResoCsv(RAW_RESO_CSV);

// Helper to search fields (for the Combobox)
export const searchResoFields = (query: string): ResoFieldDefinition[] => {
  if (!query) return RESO_STANDARD_FIELDS;
  const lowerQuery = query.toLowerCase();
  return RESO_STANDARD_FIELDS.filter(field => 
    field.StandardName.toLowerCase().includes(lowerQuery) || 
    field.DisplayName.toLowerCase().includes(lowerQuery)
  );
};
