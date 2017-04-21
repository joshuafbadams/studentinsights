$(function() {

  if ($('body').hasClass('schools') && $('body').hasClass('star_reading')) {
    const MixpanelUtils = window.shared.MixpanelUtils;
    const StarChartsPage = window.shared.StarChartsPage;
    const merge = window.shared.ReactHelpers.merge;

    function main() {
      const serializedData = $('#serialized-data').data();
      MixpanelUtils.registerUser(serializedData.currentEducator);
      MixpanelUtils.track('PAGE_VISIT', { page_key: 'STAR_READING_PAGE' });

      ReactDOM.render(<StarChartsPage
        students={serializedData.studentsWithStarResults}
        dateNow={new Date()}
        serviceTypesIndex={serializedData.constantIndexes.service_types_index}
        eventNoteTypesIndex={serializedData.constantIndexes.event_note_types_index}
        initialFilters={Filters.parseFiltersHash(window.location.hash)}
        history={window.history} />, document.getElementById('main'));
    }

    main();
  }
});
