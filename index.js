import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import moment from "moment";
import jsPDF from "jspdf";
import {
  getConsultationById,
  getPrescriptionByCIdApi,
} from "../../api/consultation";
import { getFormattedDate } from "../../helpers";
import { Grid, Button } from "@material-ui/core";
import HospitalLogo from "../../assets/images/upload_default.jpeg";
import "./style.css";

function PatientPrescription(props) {
  const avoidCache = (url) => url + "?v=" + new Date().getTime();

  const consultationId =
    props && props.match && props.match.params && props.match.params.consultId;
  const [prescriptionInfo, setPrescriptionInfo] = useState({});
  const [consultation, setConsultation] = useState({});

  useEffect(() => {
    getPrescriptionByCIdApi(consultationId).then(
      (res) =>
        res && res.status < 350 && res.data && setPrescriptionInfo(res.data)
    );
    getConsultationById(consultationId).then(
      (res) => res && res.status < 350 && res.data && setConsultation(res.data)
    );
  }, [consultationId]);

  const downloadDiv = () => {
    console.log(prescriptionInfo);
    const input = document.getElementById("PrintContainer");
    html2canvas(input, {
      allowTaint: false,
      useCORS: true,
      logging: true,
    }).then((canvas) => {
      let imgData = canvas.toDataURL("image/jpeg");
      console.log(imgData);
      // imgData.crossOrigin = "Anonymous";
      let imgWidth = 210;
      let pageHeight = 295;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let doc = new jsPDF({ compress: true });
      let position = 0;

      doc.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(
          imgData,
          "JPEG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        heightLeft -= pageHeight;
      }
      doc.save(`${prescriptionInfo._id}_${moment().format("yyyy-MM-DD")}.pdf`);
    });
  };

  return (
    <div className="newSecurraContainer">
      <div id="PrintContainer">
        {consultation &&
          consultation._id &&
          prescriptionInfo &&
          prescriptionInfo._id &&
          prescriptionInfo.clinic && (
            <>
              <div className="Container">
                <div className="InnerDrContainer">
                  <img
                    src={
                      (consultation.clinic.logo &&
                        avoidCache(consultation.clinic.logo)) ||
                      HospitalLogo
                    }
                    alt=" "
                    className={consultation?.clinic?.logo ? "HospitalLogoImg ExtraSpace" : "HospitalLogoPlaceholder"}
                    crossOrigin="anonymous"
                  />
                  <div className="drdetails drname">
                    DR. {prescriptionInfo.doctor.name}
                  </div>
                  <div className="drdetails dr_designation">
                    {prescriptionInfo.doctor.department &&
                      prescriptionInfo.doctor.department !== "NA" &&
                      prescriptionInfo.doctor.department}
                  </div>
                  <div className="drdetails dr_regnumber">
                    {consultation.doctor.doctorCode &&
                      consultation.doctor.doctorCode !== "NA" &&
                      "Registration number : " + consultation.doctor.doctorCode}
                  </div>
                  {consultation.clinic && consultation.clinic.address && (
                    <div className="drdetails dr_hospitalname">
                      {prescriptionInfo.clinic.address}
                    </div>
                  )}
                  <div className="dr_contactdetails">
                    <span>ph: +91 {prescriptionInfo.clinic.phone || ""}</span>
                    <span className="dr_email">
                      Email: {prescriptionInfo.clinic.email || ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="Container MarginAbove">
                <div className="Heading">BASIC DETAILS</div>
                <hr className="HorizontalLine" />
                <div className="InnerDrContainer">
                  <Grid container direction="row" justify="flex-start">
                    <Grid item xs={5} sm={3} md={2} className="">
                      Date of consultation
                    </Grid>
                    <Grid item xs={7} sm={9} md={10}>
                      :&nbsp;&nbsp;&nbsp;
                      {getFormattedDate(
                        prescriptionInfo.general.dateOfConsultation
                      )}
                    </Grid>
                    <Grid item xs={5} sm={3} md={2} className="">
                      Name of patient
                    </Grid>
                    <Grid item xs={7} sm={9} md={10}>
                      :&nbsp;&nbsp;&nbsp;{prescriptionInfo.general.patient.name}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={2} sm={1} className="">
                      Age <span className="LastColon">:</span>
                    </Grid>
                    <Grid item xs={2} sm={1} className="LineBreak">
                      {prescriptionInfo.general.patient.age}
                    </Grid>
                    <Grid item xs={2} sm={1} className="">
                      Gender <span className="LastColon">:</span>
                    </Grid>
                    <Grid item xs={6} sm={8} className="LineBreak">
                      {prescriptionInfo.general.patient.gender}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={2} sm={1} className="">
                      Height <span className="LastColon">:</span>
                    </Grid>
                    <Grid item xs={2} sm={1} className="LineBreak">
                      {prescriptionInfo.general.patient.height}
                    </Grid>
                    <Grid item xs={2} sm={1} className="">
                      Weight <span className="LastColon">:</span>
                    </Grid>
                    <Grid item xs={2} sm={1} className="LineBreak">
                      {prescriptionInfo.general.patient.weight}
                    </Grid>
                    <Grid item xs={2} sm={1} className="">
                      LMP <span className="LastColon">:</span>
                    </Grid>
                    <Grid item xs={2} sm={7}>
                      {prescriptionInfo.general.patient.lmp}
                    </Grid>
                  </Grid>
                </div>
              </div>
              {prescriptionInfo.medical &&
                (prescriptionInfo.medical.chiefComplaints ||
                  prescriptionInfo.medical.relevantPointsFromHistory ||
                  prescriptionInfo.medical.examinationFindings ||
                  prescriptionInfo.medical.suggestedInvestigation) && (
                  <div className="Container MarginAbove">
                    <div className="Heading">Medical Information</div>
                    <hr className="HorizontalLine" />
                    <div className="InnerContainer Gray">
                      {prescriptionInfo.medical.chiefComplaints && (
                        <>
                          <div className="subHeading">Chief complaints</div>
                          <div className="medicalinfo_block Gray">
                            {prescriptionInfo.medical.chiefComplaints}
                          </div>
                        </>
                      )}
                      {prescriptionInfo.medical.relevantPointsFromHistory && (
                        <>
                          <div className="subHeading">
                            Relevant points from history
                          </div>
                          <div className="medicalinfo_block Gray">
                            {prescriptionInfo.medical.relevantPointsFromHistory}
                          </div>
                        </>
                      )}
                      {prescriptionInfo.medical.examinationFindings && (
                        <>
                          <div className="subHeading">
                            Examination / Lab Findings
                          </div>
                          <div className="medicalinfo_block Gray">
                            {prescriptionInfo.medical.examinationFindings}
                          </div>
                        </>
                      )}
                      {prescriptionInfo.medical.suggestedInvestigation && (
                        <>
                          <div className="subHeading">Suggested Diagnosis</div>
                          <div className="medicalinfo_block Gray">
                            {prescriptionInfo.medical.suggestedInvestigation}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              {prescriptionInfo.rxDetails &&
                prescriptionInfo.rxDetails.length > 0 && (
                  <div className="Container MarginAbove">
                    <div className="Heading">Rx Details</div>
                    <hr className="HorizontalLine" />
                    {prescriptionInfo.rxDetails.map((v, i) => (
                      <div
                        className="InnerContainer innercontainer_overwite"
                        key={i}
                      >
                        {i !== 0 && <hr className="HorizontalLine spaceline" />}
                        <Grid container>
                          <Grid item xs={1} className="Gray">
                            {i + 1} .{" "}
                          </Grid>
                          <Grid item xs={11} className="Gray">
                            Medicine name (In Capital letters*)
                          </Grid>
                          <Grid item xs={1}></Grid>
                          <Grid item xs={11}>
                            {v}
                          </Grid>
                        </Grid>
                      </div>
                    ))}
                  </div>
                )}
              {prescriptionInfo.specialInstructions && (
                <div className="Container MarginAbove">
                  <div className="Heading">Special Instruction</div>
                  <hr className="HorizontalLine" />
                  <div className="InnerContainer c_special_prohibited">
                    <Grid container>
                      <Grid item>{prescriptionInfo.specialInstructions}</Grid>
                    </Grid>
                  </div>
                </div>
              )}
              <div className="Container MarginAbove">
                <div className="InnerContainer c_special_prohibited">
                  {consultation.doctor.signature && (
                    <div className="DoctorSignature">
                      <img
                        src={avoidCache(consultation.doctor.signature)}
                        alt=" "
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}
                  <div className="DoctorName">
                    Dr. {consultation.doctorName}
                  </div>
                  <div className="DoctorRegn">
                    REGN. NO. {consultation.doctor.doctorCode}
                  </div>
                  <div className="DoctorRegn">
                    {consultation.doctor.department}
                  </div>
                  <div className="DoctorRegn">
                    {consultation.clinic.name},{" "}
                    {consultation.clinic.address &&
                      consultation.clinic.address.city}
                  </div>
                </div>
              </div>
              <div className="Container MarginAbove Marginbottom">
                <hr className="HorizontalLine" />
                <div className="InnerContainer c_special_prohibited Prohibited_Container">
                  <Grid container>
                    <Grid item>
                      <span className="Prohibited">Prohibited List: </span> An
                      RMP providing via telemedicine cannot prescribe medicines
                      in the Schedule X list of Drug and Cosmetic ACT,these
                      medicines have potential of abuse and could harm the
                      patient or the society at large if used improperly.
                    </Grid>
                  </Grid>
                </div>
              </div>
            </>
          )}
      </div>
      <Button
        color="primary"
        id="FloatingPDFButton"
        onClick={() => downloadDiv()}
        variant="contained"
      >
        Download as PDF
      </Button>
    </div>
  );
}

export default PatientPrescription;
